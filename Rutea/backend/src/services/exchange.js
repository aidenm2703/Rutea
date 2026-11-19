import { HttpError } from '../middlewares/errors.js'

const bankEndpoint = 'https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicosXML'
const marketEndpoint = 'https://open.er-api.com/v6/latest/USD'
const bankSource = 'BCCR'
const marketSource = 'ExchangeRate-API'

export function parseBccr(xml) {
  const normalized = xml.replaceAll('&lt;', '<').replaceAll('&gt;', '>')
  const day = /<DES_FECHA>((\d{4})-(\d{2})-(\d{2}))[T<]/.exec(normalized)?.[1]
  const rate = Number(/<NUM_VALOR>([\d.]+)<\/NUM_VALOR>/.exec(normalized)?.[1])
  if (!day || !Number.isFinite(rate) || rate <= 0) throw new Error('Invalid BCCR response')
  return { observed_on: day, rate }
}

export function createExchangeService(model, { bccr, fetcher = fetch } = {}) {
  let refresh
  let lastError = 0

  async function request(url, options = {}) {
    const response = await fetcher(url, { ...options, signal: AbortSignal.timeout(5000), redirect: 'error' })
    if (!response.ok) throw new Error('Remote service unavailable')
    return response
  }

  async function market() {
    const data = await (await request(marketEndpoint)).json()
    const rate = data.rates?.CRC
    const unix = data.time_last_update_unix
    if (data.result !== 'success' || data.base_code !== 'USD' || !Number.isFinite(rate) || rate <= 0 ||
        !Number.isInteger(unix) || unix <= 0 || unix * 1000 > Date.now() + 3600000) throw new Error('Invalid FX response')
    return [{ kind: 'market', rate, observed_on: new Date(unix * 1000).toISOString().slice(0,10) }]
  }

  async function bank() {
    const day = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Costa_Rica' }).format(new Date())
    return Promise.all([['317','buy'],['318','sell']].map(async ([indicator,kind]) => {
      const body = new URLSearchParams({
        Indicador: indicator, FechaInicio: day, FechaFinal: day, Nombre: bccr.name,
        SubNiveles: 'N', CorreoElectronico: bccr.email, Token: bccr.token,
      })
      const response = await request(bankEndpoint, { method: 'POST', body })
      return { kind, ...parseBccr(await response.text()) }
    }))
  }

  async function refreshRates(source) {
    try {
      await model.saveRates(source, await (source === bankSource ? bank() : market()))
    } catch {
      await model.event('exchange.failure.' + source)
      throw new HttpError(503, 'El proveedor de tipo de cambio no está disponible.')
    }
    await model.event('exchange.success.' + source)
  }

  async function liveMarket() {
    let rate = await model.rate(marketSource, 'market')
    if (rate && Date.now() - Date.parse(rate.fetched_at) < 24 * 3600000) return { ...rate, fallback: false }
    if (!refresh && Date.now() - lastError > 60000) {
      refresh = refreshRates(marketSource).catch(() => { lastError = Date.now() }).finally(() => { refresh = null })
    }
    await refresh
    if (Date.now() - lastError > 60000) {
      rate = await model.rate(marketSource, 'market')
      if (rate) return { ...rate, fallback: false }
    }
    if (rate) return { ...rate, fallback: true }
    throw new HttpError(503, 'Todavía no hay un tipo de cambio disponible.')
  }

  return {
    async latest() {
      const [buy, sell] = await Promise.all([model.rate(bankSource,'buy'), model.rate(bankSource,'sell')])
      if (buy && sell) {
        const fallback = Date.now() - Date.parse(sell.fetched_at) >= 36 * 3600000
        return { ...sell, fallback, buyRate: buy.rate, buyDate: buy.observed_on }
      }
      return liveMarket()
    },
    async refreshBank() {
      if (!bccr?.name || !bccr.email || !bccr.token) throw new HttpError(503, 'Configura las credenciales del BCCR.')
      await refreshRates(bankSource)
      return { buy: await model.rate(bankSource,'buy'), sell: await model.rate(bankSource,'sell') }
    },
  }
}
