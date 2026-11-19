export function createWeatherService({ fetcher = fetch } = {}) {
  return async (place) => {
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.search = new URLSearchParams({
      latitude: place.latitude, longitude: place.longitude,
      timezone: 'America/Costa_Rica', forecast_days: 7,
      daily: 'temperature_2m_min,temperature_2m_max,precipitation_sum',
    })
    const response = await fetcher(url, { signal: AbortSignal.timeout(5000), redirect: 'error' })
    if (!response.ok) throw new Error('Pronóstico no disponible.')
    const { daily } = await response.json()
    if (!Array.isArray(daily?.time) || daily.time.length > 7) throw new Error('Pronóstico inválido.')
    const days = daily.time.map((day, index) => ({
      day, lowC: daily.temperature_2m_min?.[index], highC: daily.temperature_2m_max?.[index],
      precipitationMm: daily.precipitation_sum?.[index],
    })).filter(({ day, lowC, highC, precipitationMm }) => /^\d{4}-\d{2}-\d{2}$/.test(day) &&
      [lowC, highC, precipitationMm].every(Number.isFinite))
    if (!days.length) throw new Error('Pronóstico sin observaciones.')
    return { days, source: 'https://open-meteo.com/', retrievedAt: new Date().toISOString() }
  }
}
