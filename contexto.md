Documento de contexto para asistentes de programación. Versión 1.0 — 19/11/2026.
Fuentes: «Rutea — Anteproyecto del Proyecto Final Full Stack» (borrador del 19/11/2026) y «Proyecto Final Full Stack — FWD Costa Rica» (enunciado oficial, noviembre de 2026).
Jerarquía: el enunciado oficial determina los mínimos obligatorios; el anteproyecto describe la solución propuesta. Este documento añade recomendaciones de implementación marcadas como propuestas. No interpretar propuestas como decisiones aprobadas ni como funcionalidades terminadas.

1. Identidad, problema y visión
- Nombre provisional: Rutea; comprobar disponibilidad de marca y dominio.
- Autores del anteproyecto: Aiden Montero Pérez y Bianka Robles.
- Programa: Desarrollo Web Full Stack, FWD Costa Rica. Profesor: Barry.
- Primer avance: jueves 03/12/2026. Segundo avance: miércoles 09/12/2026.
- Mercado inicial: Costa Rica y sus siete provincias; catálogo inicial curado.
- Usuarios: turistas nacionales/internacionales, personas con necesidades de accesibilidad, familias, personas veganas/vegetarianas, viajeros con mascotas, negocios turísticos y equipo de revisión.
Problema: la información de viajes está dispersa entre mapas, redes, hoteles, blogs y mensajes; faltan fuentes, fechas y certeza de datos importantes como accesibilidad, precios y opciones alimentarias.

Solución: plataforma web responsive que acompañe el viaje antes (descubrir, comparar y planear), durante (registrar visitas, sellos, información útil) y después (pasaporte, recuerdos y fotos privadas/compartidas con permiso). No pretende reemplazar Google Maps ni actuar como agencia de viajes.

Principios: información trazable; accesibilidad específica; datos desconocidos claramente identificados; gamificación sin necesidad de gastar; privacidad por defecto; navegación clara; no inventar disponibilidad ni precios.
2. Límites y estado del alcance
Nivel 1 — obligatorio en el plan de Rutea
Autenticación, roles, lugares/mapa/filtros, accesibilidad y procedencia de información, favoritos, reseñas, pasaporte/sellos/insignias, ocho agentes IA, API externa real, tres workflows n8n, gobernanza, pruebas, GitHub y documentación. Este nivel incluye compromisos propios del anteproyecto además de mínimos del profesor.
Nivel 2 — valor agregado, solo después de completar Nivel 1
Avatar personalizable, amigos, controles de privacidad social y fotos en lugares, viajes básicos con presupuesto/equipaje, panel de negocio, confianza que disminuye con antigüedad y cuarto workflow.
Visión futura — NO construir para la entrega inicial
Cupones/recompensas QR, gastos compartidos y votaciones grupales, offline, álbumes multimedia extensos, rutas creadas por comunidad, internacionalización, API pública de accesibilidad.
Fuera de alcance de la primera entrega
Reservas y pagos internos: mostrar enlaces oficiales de proveedores cuando existan. No afirmar que hay cupos o tarifas vigentes sin fuente. No convertir la plataforma en marketplace de reservas.
3. Roles y permisos
Rol	Capacidades previstas
Viajero/cliente	Registro, sesión, explorar, filtros, favoritos, reseñas, viajes, pasaporte, fotos/amigos si Nivel 2, agentes autorizados, consentimiento y baja
Negocio/colaborador	Solicitar titularidad de ficha, proponer cambios sujetos a aprobación, estadísticas agregadas, responder reseñas
Moderador/editor/colaborador	Revisar reseñas y reportes, cambios de fichas, herramientas de moderación
Administrador	Usuarios, roles, lugares, reglas de insignias, configuración, agentes, informes
Auditor	Solo lectura de bitácoras, integraciones, consentimientos y solicitudes de baja


El anteproyecto establece un rol principal por cuenta. La autorización real ocurre en Express, no basta ocultar botones en React. Los módulos de negocio y social del Nivel 2 pueden representarse en el diseño y ampliarse luego.
4. Módulos previstos (M1–M11)
1. M1 Cuentas y autenticación: registro, login, recuperación, perfil, sesión, aceptación de políticas.
2. M2 Lugares y mapa: catálogo por provincia/categoría, filtros, ficha, accesibilidad granular, fuentes, fecha de revisión, favoritos, correcciones.
3. M3 Reseñas y moderación: reseñas por criterios, reportes, revisión/bloqueo.
4. M4 Pasaporte: visitas autorregistradas, sellos, insignias y reglas configurables. No afirmar geolocalización verificada si solo existe autorregistro.
5. M5 Social (Nivel 2): avatar, amistades, bloqueos, privacidad y fotos asociadas a lugares.
6. M6 Viajes (Nivel 2): viaje con fechas y paradas, presupuesto, gastos, equipaje.
7. M7 Negocios (Nivel 2): reclamación de fichas, verificación y cambios con historial.
8. M8 IA: servicio base, ocho agentes con control por rol y bitácora.
9. M9 Integraciones/automatización: APIs externas y workflows n8n.
10. M10 Gobernanza/auditoría: versiones de políticas, consentimientos, baja, bitácoras, vista auditor.
11. M11 Administración: usuarios, roles, fichas, reglas y registros.
5. Experiencia de usuario y pantallas
El documento oficial exige mockups de todas las pantallas, incluidas escritorio/móvil para las principales. Inventario de diseño propuesto, sujeto a revisión:
- Públicas: bienvenida/inicio, exploración pública si se permite, login, registro, recuperación, términos, privacidad.
- Viajero: dashboard, búsqueda/listado, mapa, filtros, ficha de lugar, detalle de accesibilidad/fuentes, favoritos, crear/editar reseña, reportar información, pasaporte, sellos/insignias, perfil, consentimiento y eliminación.
- IA: entrada y resultados de cada uno de los ocho agentes (pueden ser vistas en un centro de asistentes).
- Integraciones: mostrar tipo de cambio y/o clima/mapa según las APIs finalmente seleccionadas, con fecha y fuente.
- Nivel 2: avatar, amigos, privacidad, galería/fotos, viajes/itinerario/presupuesto/equipaje, panel de negocio, reclamo de ficha.
- Moderador: cola de reportes, reseñas, propuestas de cambios y resultados del agente de moderación.
- Administrador: dashboard, usuarios/roles, fichas, insignias, auditorías de ejecuciones.
- Auditor: consulta solo lectura de consentimientos, ejecuciones, integraciones y bajas.
- Estados transversales: carga, error, sin resultados, sin permiso, sesión expirada, confirmación, dato desconocido y API no disponible.
No hay libro de marca ni mockups finales aprobados en los documentos aportados: pendientes de diseño.
6. Arquitectura técnica
- Frontend: React + Vite, React Router, contexto de sesión; CSS y variables del futuro libro de marca.
- Backend: Node.js + Express REST, separación routes → middlewares → controllers → services → models.
- Base: PostgreSQL + PostGIS, SQL relacional al menos 3FN; consultas parametrizadas.
- Seguridad: bcrypt para contraseñas, JWT firmado con secreto en .env, expiración, verificación de rol, validación de entradas, límites de peticiones y errores centralizados.
- Testing: Jest con mocks para APIs/IA, pruebas de autenticación, permisos, controladores y servicios.
- Automatización: n8n; tres workflows reales exportados en JSON.
- Versionado: Git/GitHub con main, develop, feature/*, fix/*, PR y commits descriptivos.
rutea/
  frontend/
    src/
  backend/
    src/
      server.js
      config/
      routes/
      middlewares/
      controllers/
      services/
        agents/
      models/
    tests/
    .env.example
  database/
    schema.sql
    seed.sql
    ERD-y-diccionario/
  n8n/
    onboarding.json
    tipo-cambio.json
    eliminacion-datos.json
  docs/
    anteproyecto/
    agentes/
    apis/
  README.md
Regla: credenciales solo en backend/variables de entorno; nunca incluir .env real en GitHub. Las rutas deben verificar propiedad del recurso y permisos. Para fotos, validar formato/tamaño, quitar EXIF y aplicar privacidad.
7. Datos y entidades
Entidades agrupadas en el anteproyecto (nombres propuestos, a validar al modelar):
- Seguridad: users, roles, password_resets.
- Lugares: provinces, places, place_categories, place_category_links, place_sources, place_prices, place_opening_hours, accessibility_features, place_accessibility, accessibility_evidence.
- Comunidad: favorites, reviews, moderation_reports.
- Pasaporte: visits, stamps, achievements, achievement_rules, user_achievements.
- Social: friendships, user_blocks, privacy_settings, place_photos; avatar_config en perfil.
- Viajes: trips, itinerary_items, trip_expenses, packing_lists, packing_items.
- Negocios: businesses, business_claims.
- IA e integraciones: ai_agents, ai_agent_runs, integration_logs, exchange_rates, knowledge_documents.
- Gobernanza: policy_versions, terms_acceptances, consents, deletion_requests, audit_logs.
Reglas: claves primarias/foráneas y cardinalidades; N:M con tablas puente; evitar campos multivalor y duplicación; documentar campos, tipos y finalidad; crear schema.sql y seed.sql.
8. Ocho agentes de IA (previstos)
Agente	Entrada	Salida	Condición importante
1. Pregúntale a Rutea (RAG)	Pregunta y contexto	Respuesta sobre cultura/lugares con fuentes	Recuperar documentos/fichas, citar fuente, no inventar
2. Planificador de itinerarios	Días, intereses, presupuesto, necesidades	Propuesta de paradas	Cercanía y orden calculados en backend/PostGIS
3. Accesibilidad	Necesidades y lugar	Filtros/explicación	Distinguir confirmado, reportado y desconocido; evidencia/fecha
4. Maleta y clima	Fechas, actividades, pronóstico	Lista de equipaje	Pronóstico obtenido de API real, si está disponible
5. Presupuesto y gastos	Presupuesto, gastos, divisa	Clasificación, comparación y conversión	Tipo de cambio con fecha y fuente
6. Moderador de reseñas	Reseña/reporte	Señales de spam, abuso o publicidad	Decisión final humana
7. Recuerdos y diario	Itinerario, notas, visitas, sellos	Resumen editable del viaje	Solo contenido autorizado por el usuario
8. Cumplimiento y privacidad	Contenido público o solicitud de auditoría	Alertas de datos personales y revisión	No revelar datos privados ni ejecutar bajas por sí solo


Implementar servicio base para comprobar rol, minimizar datos, invocar proveedor, validar salida y registrar en ai_agent_runs: agente, usuario, fecha, estado, duración y resúmenes seguros. Cada agente debe tener documentación de objetivo, rol, entrada, salida, modelo/proveedor y privacidad. Proveedor de IA pendiente de selección.
9. Integraciones externas
- BCCR: tipo de cambio CRC/USD; requiere registro/token según anteproyecto.
- Hacienda: posible verificación de identificación de negocios; condiciones por confirmar.
- Clima: proveedor por definir; verificar límites, costos y licencia.
- Mapas/geocodificación: proveedor por definir; revisar condiciones y licencias de mapas.
- Modelo de IA: proveedor por definir.
Mínimo oficial: una API externa real consumida desde backend. Manejar timeout, errores y fecha del último dato válido. No presentar datos almacenados como actualizados en tiempo real.
10. Workflows n8n: obligatorios y personalización
Tres previstos en el anteproyecto
1. Onboarding: registro confirmado en backend → webhook autenticado → bienvenida; rol inicial y aceptación de términos se establecen y registran de forma autoritativa en backend/BD, no se delegan sin control al webhook.
2. Tipo de cambio diario: Schedule Trigger → backend/servicio consulta BCCR → guarda exchange_rates → resumen por correo y registro de ejecución.
3. Eliminación de datos: solicitud autenticada y confirmada en backend → trabajo seguro de anonimización/eliminación → bitácora → notificación; nunca borrar por un webhook público sin autorización.
Opcional Nivel 2: revisión de fichas con información vencida para moderadores.
Ideas adicionales discutidas — NO son exigencias oficiales ni compromisos de entrega
Recordatorios de viajes, avisos meteorológicos, cambios de accesibilidad, felicitación por insignias, recomendaciones semanales y generación de recuerdos. Un workflow compartido puede leer preferencias por usuario: no crear uno nuevo por cada viajero.

Diseño propuesto de personalización: notification_preferences(user_id, notification_type, enabled, frequency, lead_days, channel, updated_at) (ajustar y normalizar en ERD). React permite activar/desactivar; backend valida consentimiento y propiedad; n8n consulta usuarios elegibles y evita duplicados. En la primera versión puede limitarse a ajustes fijos y pocos disparadores.

No confundir: agentes IA = lógica inteligente dentro de services; workflows n8n = orquestación/automatización; servicios del backend = reglas de negocio y autorizaciones.
11. Privacidad, calidad y gobernanza
- Ley costarricense N.º 8968 como referencia de protección de datos.
- Política de privacidad y términos visibles; aceptación explícita con versión/fecha.
- Consentimientos separados cuando proceda; minimización de datos enviados a proveedores.
- Solicitud de baja desde perfil, verificación de identidad, ejecución, notificación y registro; explicar retenciones legalmente necesarias.
- Pasaporte y fotos privados por defecto; ubicación precisa nunca pública.
- Información de accesibilidad: cada afirmación debe indicar procedencia, revisión y confianza. Ausencia de información = desconocido, nunca inaccesible ni accesible confirmado.
- Auditoría de agentes, integraciones, consentimiento y eliminación; auditor solo lectura.
- Revisar edad mínima y tratamiento de menores con el profesor.
12. Entregables y prioridades de trabajo
1. Anteproyecto completo: portada, índice, introducción, desarrollo, objetivos, RF/RNF codificados, HU con criterios, todos los mockups, libro de marca y cronograma diario.
2. Modelo ER con atributos/PK/FK/cardinalidades, diccionario, SQL normalizado 3FN y seed.
3. Frontend y backend funcionales, autenticación, roles, módulos Nivel 1.
4. Ocho agentes reales con pantallas, logs y documentación.
5. Al menos una API externa real, documentada.
6. Tres workflows n8n exportados y documentados.
7. Pruebas ejecutables, GitHub con ramas/PR, README, .env.example.
8. Privacidad, términos, consentimientos, eliminación de cuenta y demostración ante el profesor.
13. Instrucciones para cualquier IA que implemente Rutea
1. Leer también REQUISITOS_RUTEA.md; el enunciado oficial prevalece sobre propuestas.
2. Antes de codificar, explicar qué RF/HU se implementarán y qué módulos/tablas/rutas cambiarán.
3. No afirmar que una función está hecha si solo existe mockup, prompt, mock de API o respuesta estática.
4. Priorizar Nivel 1. No añadir pagos, reservas internas, QR ni complejidad social sin autorización.
5. Implementar autorización en backend, validación, logs seguros y pruebas por funcionalidad.
6. Nunca inventar información de accesibilidad, tarifas, disponibilidad, fuentes o fechas.
7. Documentar decisiones pendientes y dependencias externas; no suponer que una API es gratuita o accesible.
8. Mantener arquitectura por capas y diseño responsive.
9. Acompañar cada implementación con pruebas, migraciones/SQL, documentación y actualización de estado.
10. Tratar este archivo como contexto y plan, no como evidencia de implementación completada.
14. Decisiones pendientes
- Nombre/marca y dominio definitivos; identidad visual/libro de marca.
- Proveedores y credenciales para mapas, clima, IA y BCCR; condiciones de Hacienda.
- Edad mínima, política de menores y criterios de revisión de datos.
- Qué partes de Nivel 2 caben en calendario; estrategia de despliegue y almacenamiento de fotos.
- Criterios exactos para otorgar sellos e insignias y reglas antifraude de autorregistro.
- Diseño detallado de endpoints, atributos y esquema relacional final.
ANEXO DE ACTUALIZACIÓN — Anteproyecto complementado (19/11/2026)
Fuente adicional: RUTEA_Anteproyecto_Complementado_v1.docx (20 páginas). Las secciones anteriores siguen vigentes salvo aclaraciones explícitas. Este anexo incorpora información nueva sin convertir los planes en funcionalidades implementadas.
Identidad y libro de marca definido en el anteproyecto complementado
- Nombre presentado: RUTEA. Lema: «Tu ruta, tu experiencia». La verificación de marca y dominio sigue pendiente.
- Integrantes en el documento complementado: Aiden Montero Pérez y Bianca Robles. El anteproyecto anterior decía «Bianka Robles»: confirmar ortografía oficial antes de entregar; no asumir que son personas distintas.
- Misión: facilitar experiencias turísticas en Costa Rica mediante información verificable, planificación personalizada y herramientas accesibles.
- Visión: ser referencia digital de turismo responsable e inclusivo en Costa Rica, preparada para crecer a otros destinos.
- Valores: confianza, inclusión, curiosidad, respeto cultural, privacidad y sostenibilidad.
- Personalidad: cercana, clara, optimista, informada y respetuosa; nunca promete certezas sin evidencia.
- Tono: frases útiles como «Revisa la fuente» y «Planifica a tu ritmo»; evitar alarmismo y promesas absolutas como «totalmente accesible».
- Logo propuesto: RUTEA en mayúsculas, con ruta ascendente integrada en la R; isotipo de pin de mapa con curva de ruta. Versión negativa blanca sobre azul profundo.
- Protección del logo: margen libre equivalente a la altura de la U; tamaños mínimos digital 120 px (logotipo) / 24 px (isotipo); impresión 30 mm / 8 mm.
- Paleta: Azul Ruta #0B2A4A (principal), Turquesa Vivo #12A8A8 (acciones), Arena Clara #F5F0E6 (fondos), Verde Bosque #2E6B4B (naturaleza), Carbón #1D252C (texto).
- Tipografías: Poppins para títulos/botones; Inter para texto. Iconos lineales redondeados; fotografía realista, diversa y respetuosa.
- Uso incorrecto: no deformar, girar, recolorear, añadir sombras al logo ni colocarlo sobre fondos sin contraste.
Inventario P01–P12 de pantallas del anteproyecto complementado
ID	Pantalla	Contenido principal	Vista prevista
P01	Inicio y exploración	Buscador, categorías, destacados, fuentes	Escritorio y móvil
P02	Login, registro, recuperación	Validación, consentimiento, errores	Escritorio y móvil
P03	Mapa y filtros	Provincia, categoría, costo, accesibilidad	Escritorio y móvil
P04	Ficha de lugar	Evidencia, fechas, favoritos, reseñas, reportes	Escritorio y móvil
P05	Pasaporte	Visitas, sellos, insignias, privacidad	Escritorio y móvil
P06	Agentes Rutea	Selector, entrada, respuesta, fuentes y aviso IA	Escritorio y móvil
P07	Viaje y presupuesto	Fechas, paradas, clima, tipo de cambio, gastos	Escritorio y móvil
P08	Perfil y privacidad	Preferencias, consentimientos, baja	Escritorio y móvil
P09	Moderación	Cola de reseñas, evidencia y decisiones	Escritorio
P10	Administración	Lugares, roles, insignias, auditoría	Escritorio
P11	Solicitud de negocio	Reclamo, datos, estado de revisión	Escritorio y móvil
P12	Legales	Políticas, términos, confirmación de baja	Escritorio y móvil


Advertencia de cobertura: P01–P12 es el inventario de alto nivel del documento, no garantiza por sí solo que estén diseñadas todas las pantallas exigidas por FWD: completar dashboards de cada rol, pantallas específicas de los ocho agentes, auditor y estados de carga/vacío/error, además de las versiones móviles requeridas. El documento complementado presenta un plan de mockups, no todos los mockups terminados.
Cronograma de trabajo propuesto en el documento complementado
- 20/11: alcance, marca, anteproyecto.
- 21/11: RF/HU y modelo ER.
- 22/11: mockups principales responsive.
- 23/11: repositorio, ramas, estructura frontend/backend.
- 24/11: SQL, seed y conexión PostgreSQL.
- 25–26/11: registro, bcrypt, JWT, roles, rutas y pruebas de autenticación.
- 27/11: catálogo, filtros y fichas.
- 28/11: favoritos, reseñas y moderación.
- 29/11: pasaporte, visitas e insignias.
- 30/11: BCCR, clima y bitácoras.
- 01–02/12: servicio base y ocho agentes, pruebas y demostración.
- 03/12: primer avance.
- 04–06/12: n8n, baja, gobernanza y legales.
- 07–08/12: pruebas integrales, correcciones y documentación.
- 09/12: segundo avance.
- 10–19/12: despliegue, URL pública, capturas y ensayo de presentación (plan del anteproyecto, no fecha oficial adicional de entrega).
Evidencia final expresamente planificada
schema.sql, seed.sql, diagrama ER, diccionario de datos, .env.example, pruebas Jest, tres JSON exportados de n8n, documentación de agentes/APIs, README, URL(s) públicas y capturas de la demostración. No confundir «planificado» con «terminado».
Reglas de reconciliación entre documentos
1. Enunciado oficial FWD > decisiones del anteproyecto > sugerencias de implementación.
2. El anteproyecto complementado numera RF-01…RF-20, RNF-01…RNF-12 y HU-01…HU-12; REQUISITOS_RUTEA.md usa una matriz más extensa con numeración propia. No fusionar códigos automáticamente: conservar la matriz de trazabilidad del archivo de requisitos y el mapeo añadido allí.
3. En el documento complementado, RF-14 (viajes) y RF-15 (negocios) son prioridad media; el alcance de Rutea ya los ubica en Nivel 2. No adelantar por aparecer en mockups.
4. Los tres workflows n8n ya están definidos en ambos archivos: onboarding, tipo de cambio y eliminación. No duplicarlos al añadir este anexo.