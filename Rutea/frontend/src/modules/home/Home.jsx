import arenal from '../../assets/arenal.jpg'
import './Home.css'

const features = [
  ['Encuentra tu próximo destino', 'Explora lugares por provincia, categoría y opciones de alimentación.'],
  ['Consulta la accesibilidad', 'Revisa las características de cada lugar y la fuente de la información.'],
  ['Lleva tu pasaporte', 'Guarda tus favoritos y registra tus visitas para ganar insignias.'],
]

export default function Home({ signedIn }) {
  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-intro">
          <h1 id="home-title">Descubre <span>Costa Rica</span> <em>a tu ritmo.</em></h1>
          <p>Rutea es tu guía de turismo accesible en Costa Rica. Encuentra lugares que se adapten a tus necesidades y planifica cada visita con información que puedes verificar.</p>
          <div className="home-actions">
            <a className="home-primary" href={signedIn ? '#explorar' : '#cuenta'}>
              {signedIn ? 'Explorar destinos' : 'Iniciar sesión'} <span aria-hidden="true">↗</span>
            </a>
            {!signedIn && <a className="home-explore" href="#explorar">Explorar destinos</a>}
          </div>
        </div>
        <figure className="home-photo">
          <img src={arenal} width="1280" height="848" alt="El volcán Arenal reflejado en el lago, entre montañas cubiertas de bosque" />
          <figcaption>
            <strong>Volcán Arenal, Alajuela</strong>
            <small>
              <a href="https://commons.wikimedia.org/wiki/File:Volc%C3%A1n_Arenal_desde_el_lago_Arenal.jpeg">Andresqsz</a>
              {' · '}<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>
            </small>
          </figcaption>
        </figure>
      </section>
      <ul className="home-features" aria-label="Qué puedes hacer en Rutea">
        {features.map(([title, description]) => (
          <li key={title}>
            <h2>{title}</h2>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
