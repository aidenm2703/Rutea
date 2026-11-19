const general = ['traveler','moderator','admin']

export const agents = {
  culture: { name: 'Pregúntale a Rutea', roles: general, input: 'Pregunta sobre un lugar o su cultura',
    task: 'Responde solo con las fichas recuperadas, cita sus URL y avisa si la información no basta.', context: 'catalog' },
  itinerary: { name: 'Planificador de itinerarios', roles: general, input: 'Días, intereses, presupuesto y necesidades',
    task: 'Distribuye paradas recuperadas por día y zona. Usa los días, presupuesto y moneda en parameters. straightLineKmFromPrevious es distancia en línea recta. Si faltan precios o tiempos de traslado, decláralo.', context: 'catalog' },
  accessibility: { name: 'Accesibilidad', roles: general, input: 'Describe tu necesidad y selecciona un lugar',
    task: 'Distingue datos confirmados, reportados, desconocidos y ausencia confirmada. Cita cada fuente y fecha pertinente.', context: 'place' },
  packing: { name: 'Maleta y clima', roles: general, input: 'Fechas y actividades previstas',
    task: 'Organiza el equipaje en imprescindibles y opcionales. Usa solo los días de pronóstico que coincidan con el viaje e indica si faltan días.', context: 'weather' },
  budget: { name: 'Presupuesto y gastos', roles: general, input: 'Presupuesto, divisas y gastos',
    task: 'Clasifica los gastos y compara el saldo. Usa exclusivamente la tasa incluida con fecha y fuente. Si falta, conserva las divisas.', context: 'exchange' },
  moderation: { name: 'Moderador de reseñas', roles: ['moderator','admin'], input: 'Texto público a revisar',
    task: 'Señala señales de abuso, spam o publicidad y explica la razón. La decisión corresponde a un moderador.' },
  journal: { name: 'Recuerdos y diario', roles: general, input: 'Notas de viaje que autorizas usar',
    task: 'Redacta un borrador editable usando solo las notas aportadas. Omite identificadores personales.' },
  privacy: { name: 'Privacidad de publicaciones', roles: ['moderator','admin','auditor'], input: 'Texto público a revisar',
    task: 'Identifica categorías de posibles datos personales y recomienda una revisión humana, evitando copiar datos.' },
}
