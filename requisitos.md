REQUISITOS Y CRITERIOS DE ACEPTACIÓN — RUTEA
Versión 1.0 — 19/11/2026. Documento de trabajo derivado del enunciado oficial FWD Costa Rica (noviembre de 2026) y del anteproyecto Rutea.

Leyenda de procedencia: [FWD] obligación del enunciado oficial; [RUTEA-N1] compromiso del Nivel 1 del anteproyecto; [RUTEA-N2] valor agregado; [PROPUESTA] recomendación para concretar el diseño; [FUTURO] fuera de entrega inicial.

Los códigos RF, RNF y HU de este documento son una propuesta de numeración para Rutea, no códigos preexistentes en el enunciado. Revisar, aprobar y mantener consecutivos en el anteproyecto. Los criterios de aceptación son operativos/propuestos cuando el documento fuente no especifica pruebas exactas.

A. Obligaciones oficiales de FWD (resumen de cumplimiento)
ID	Obligación [FWD]	Evidencia requerida
OF-01	Anteproyecto PDF/Word con portada, índice, introducción, desarrollo, objetivo general, 3–6 específicos, requisitos, HU, mockups, libro de marca y cronograma	Documento completo
OF-02	Mockups de todas las pantallas, incluyendo login, registro/recuperación, dashboard por rol, módulos, 8 agentes, APIs, perfil, políticas, baja y escritorio/móvil principales	Diseños completos
OF-03	Libro de marca: concepto, logo/variantes, retícula/protección, tamaños, paletas HEX/RGB/CMYK, tipografías, iconografía, fotografía, tono, usos incorrectos, aplicaciones	Manual de marca
OF-04	RF/RNF únicos y consecutivos; cada uno con nombre, descripción, prioridad y rol/módulo; HU codificadas con aceptación, prioridad/estimación y referencias	Matrices trazables
OF-05	Cronograma por fecha/día/actividad/requisitos/entregable/estado; avances 03/12 y 09/12/2026	Cronograma y avances
OF-06	React, Node.js/Express por capas, SQL relacional (≥3FN), bcrypt, JWT, pruebas, Git/GitHub con ramas	Repositorio y demo
OF-07	Diagrama ER con entidades, atributos, PK/FK y cardinalidades, diccionario de datos, scripts de creación y seed	ERD + SQL + diccionario
OF-08	Roles con protección real en backend; JWT con expiración y secreto en .env; validaciones y credenciales protegidas	Rutas, middlewares y pruebas
OF-09	Mínimo 8 agentes IA funcionales dentro de services, accesibles según rol, entradas/salidas, logs, proveedor y medidas de privacidad documentadas	Demo + bitácora + fichas
OF-10	Consumir al menos una API externa real desde services, con manejo de errores/timeout y sin filtrar claves	Integración y demo
OF-11	Tres workflows n8n que repliquen procesos del sistema, exportados y documentados (disparador, pasos, problema)	Tres JSON y documentación
OF-12	Login, registro, rutas protegidas, logout, expiración de sesión, consentimiento de términos y privacidad, responsive	Demo frontend
OF-13	Pruebas unitarias para validaciones, autenticación, roles, controladores y services/agentes/APIs con mocks; comando único	Tests + README
OF-14	GitHub con ramas main, develop, feature/*, fix/*, commits y pull requests; README y .env.example	Historial de Git
OF-15	Política de privacidad, términos, consentimiento y baja con verificación de identidad, borrado/anonimización, notificación y registro	Pantallas + procesos + tablas
OF-16	Presentación y demostración funcional	Exposición final


Nota: FWD exige tres workflows, pero no obliga a que sean precisamente onboarding, BCCR y baja: esos tres fueron elegidos en el anteproyecto. FWD permite otros motores SQL relacionales; PostgreSQL/PostGIS es decisión de Rutea.
B. Requerimientos funcionales (RF)
Código	Nombre y descripción verificable	Prioridad	Rol / módulo	Origen
RF-01	Registrar cuenta con datos validados y aceptación explícita de términos/privacidad	Alta	Viajero/M1	FWD, RUTEA-N1
RF-02	Iniciar sesión y recibir sesión JWT válida	Alta	Todos/M1	FWD
RF-03	Cerrar sesión y gestionar expiración de sesión	Alta	Todos/M1	FWD
RF-04	Solicitar recuperación de contraseña de forma segura	Alta	Viajero/M1	FWD (mockup), RUTEA-N1
RF-05	Consultar y actualizar perfil propio	Alta	Viajero/M1	FWD, RUTEA-N1
RF-06	Mostrar vistas según rol y denegar acciones no autorizadas en API	Alta	Todos/M1/M11	FWD
RF-07	Consultar catálogo de lugares por provincia/categoría	Alta	Viajero/M2	RUTEA-N1
RF-08	Buscar lugares y aplicar filtros (categoría, alimentación, accesibilidad y otras propiedades disponibles)	Alta	Viajero/M2	RUTEA-N1
RF-09	Mostrar lugares en mapa integrado	Alta	Viajero/M2	RUTEA-N1
RF-10	Mostrar ficha con descripción, ubicación, información cultural, enlaces y datos con fuente/fecha/estado	Alta	Viajero/M2	RUTEA-N1
RF-11	Mostrar accesibilidad granular y evidencia; marcar explícitamente información desconocida	Alta	Viajero/M2	RUTEA-N1
RF-12	Guardar/quitar favoritos propios	Alta	Viajero/M2	RUTEA-N1
RF-13	Reportar datos incorrectos o desactualizados	Alta	Viajero/M2/M3	RUTEA-N1
RF-14	Crear/consultar reseñas vinculadas a lugar y autor	Alta	Viajero/M3	RUTEA-N1
RF-15	Moderar reseñas/reportes mediante aprobación/rechazo o acciones autorizadas	Alta	Moderador/M3	RUTEA-N1
RF-16	Registrar visita autorreportada a lugar y mostrarla en pasaporte	Alta	Viajero/M4	RUTEA-N1
RF-17	Asignar sellos e insignias según reglas definidas, evitando duplicaciones	Alta	Viajero/Admin/M4	RUTEA-N1
RF-18	Consultar pasaporte, sellos e insignias obtenidos	Alta	Viajero/M4	RUTEA-N1
RF-19	Administrar catálogo, fuentes, categorías y reglas de insignias con permisos	Alta	Admin/M11	RUTEA-N1
RF-20	Ejecutar agente 1: preguntas culturales/de lugares con recuperación de fuentes	Alta	Roles autorizados/M8	FWD, RUTEA-N1
RF-21	Ejecutar agente 2: sugerir itinerarios según días, presupuesto y necesidades	Alta	Roles autorizados/M8	FWD, RUTEA-N1
RF-22	Ejecutar agente 3: interpretar necesidades de accesibilidad y evidencia	Alta	Roles autorizados/M8	FWD, RUTEA-N1
RF-23	Ejecutar agente 4: sugerir equipaje según actividades y clima disponible	Alta	Roles autorizados/M8	FWD, RUTEA-N1
RF-24	Ejecutar agente 5: analizar presupuesto/gastos y tipo de cambio disponible	Alta	Roles autorizados/M8	FWD, RUTEA-N1
RF-25	Ejecutar agente 6: detectar posibles reseñas problemáticas para revisión humana	Alta	Moderador/M8	FWD, RUTEA-N1
RF-26	Ejecutar agente 7: generar borrador de recuerdos/diario con datos autorizados	Alta	Roles autorizados/M8	FWD, RUTEA-N1
RF-27	Ejecutar agente 8: alertar sobre posibles datos personales en contenido público	Alta	Roles autorizados/M8	FWD, RUTEA-N1
RF-28	Registrar cada ejecución de agente con agente, usuario, fecha, resultado/estado y duración	Alta	Sistema/Auditor/M8	FWD
RF-29	Consumir una API externa real útil desde backend y presentar su información con fuente/fecha	Alta	Sistema/M9	FWD
RF-30	Ejecutar workflow n8n de onboarding conectado al registro	Alta	Sistema/M9	FWD, RUTEA-N1
RF-31	Ejecutar workflow n8n de actualización del tipo de cambio	Alta	Sistema/M9	FWD, RUTEA-N1
RF-32	Ejecutar workflow n8n de solicitud de eliminación de datos con control de identidad	Alta	Sistema/M9/M10	FWD, RUTEA-N1
RF-33	Mostrar política de privacidad y términos vigentes	Alta	Todos/M10	FWD
RF-34	Guardar aceptación de términos/consentimientos con versión y fecha	Alta	Viajero/M10	FWD
RF-35	Solicitar baja desde perfil, confirmar identidad y registrar resultado/notificación	Alta	Viajero/M10	FWD
RF-36	Consultar bitácoras y solicitudes según permisos, con auditor solo lectura	Alta	Auditor/Admin/M10	FWD, RUTEA-N1
RF-37	Mostrar dashboard y pantallas de módulos y agentes según rol	Alta	Todos/Frontend	FWD
RF-38	Personalizar avatar	Media	Viajero/M5	RUTEA-N2
RF-39	Gestionar solicitudes de amistad, bloqueos y privacidad social	Media	Viajero/M5	RUTEA-N2
RF-40	Subir/consultar fotos de lugares con permisos y privacidad	Media	Viajero/M5	RUTEA-N2
RF-41	Crear/editar viajes con fechas y paradas	Media	Viajero/M6	RUTEA-N2
RF-42	Administrar presupuesto, gastos y lista de equipaje	Media	Viajero/M6	RUTEA-N2
RF-43	Reclamar ficha de negocio y solicitar ediciones con revisión	Media	Negocio/Moderador/M7	RUTEA-N2
RF-44	Revisar fichas vencidas con cuarto workflow opcional	Baja	Moderador/M9	RUTEA-N2
RF-45	Configurar preferencias de notificación y recordatorios de viaje	Baja	Viajero/M9	PROPUESTA
RF-46	Recibir recomendaciones periódicas según intereses y filtros consentidos	Baja	Viajero/M9	PROPUESTA


Importante sobre RF-21, RF-23, RF-24 y RF-26: los agentes son obligatorios por decisión de Rutea, pero las pantallas de viaje/presupuesto del Nivel 2 no lo son. Para Nivel 1 pueden usar formularios de entrada y resultados sin exigir un módulo de viajes completo. Debe haber funcionamiento real, no texto fijo.
C. Requerimientos no funcionales (RNF)
Código	Nombre y descripción	Prioridad	Módulo	Origen
RNF-01	Usar React en frontend y Node.js/Express en backend	Alta	Arquitectura	FWD
RNF-02	Separar rutas, middlewares, controladores, servicios, modelos y configuración	Alta	Backend	FWD
RNF-03	Usar SQL relacional normalizado al menos a 3FN	Alta	BD	FWD
RNF-04	Almacenar contraseñas solo como hash bcrypt	Alta	Seguridad	FWD
RNF-05	Firmar JWT con secreto en .env, expiración y payload mínimo	Alta	Seguridad	FWD
RNF-06	Validar autenticación, rol y propiedad de recursos en backend	Alta	Seguridad	FWD, RUTEA-N1
RNF-07	Validar datos de entrada y devolver errores HTTP claros	Alta	Backend	FWD
RNF-08	Mantener secretos fuera de Git; publicar solo .env.example	Alta	Seguridad	FWD
RNF-09	Usar consultas SQL parametrizadas	Alta	BD/Seguridad	RUTEA-N1
RNF-10	Interfaz responsive, accesible y con mensajes de carga/error/confirmación	Alta	Frontend	FWD; accesibilidad de interfaz como propuesta
RNF-11	Proteger datos personales, consentimiento, minimización y retención documentada	Alta	Gobernanza	FWD
RNF-12	No publicar pasaporte/fotos por defecto ni ubicación precisa	Alta	Social	RUTEA-N1/N2
RNF-13	Registrar actividad de agentes e integraciones con acceso por rol	Alta	Auditoría	FWD
RNF-14	Manejar fallos y tiempos de espera de APIs externas sin inventar datos	Alta	Integraciones	FWD, RUTEA-N1
RNF-15	Implementar pruebas unitarias ejecutables mediante un comando	Alta	QA	FWD
RNF-16	Mantener GitHub con ramas, PR, historial y README reproducible	Alta	DevOps	FWD
RNF-17	Garantizar trazabilidad de datos de lugares: fuente, fecha y estado de confianza	Alta	Lugares	RUTEA-N1
RNF-18	Proteger fotos con validación de tipo/tamaño y retirada de EXIF	Media	Social	RUTEA-N2
RNF-19	Limitar intentos de login y llamadas a agentes	Media	Seguridad	RUTEA-N1
RNF-20	Diseñar módulos y servicios mantenibles, con errores centralizados	Alta	Backend	FWD, RUTEA-N1
RNF-21	Definir y medir metas cuantitativas de tiempo de respuesta/disponibilidad antes de aprobarlas	Media	Operación	PROPUESTA; cifras pendientes
RNF-22	Evitar notificaciones duplicadas y reintentar procesos seguros con trazabilidad	Media	n8n	PROPUESTA


No se inventan porcentajes de disponibilidad ni milisegundos de rendimiento: el documento oficial pide cubrir estas categorías, pero no fija umbrales. Deben acordarse y probarse.
D. Historias de usuario (HU) y criterios de aceptación
Estimaciones en puntos orientativas, propuestas, no cifras oficiales. Cada historia referencia RF anteriores.

HU	Historia (Como…, quiero…, para…)	Criterios de aceptación mínimos propuestos	Prioridad / puntos	RF
HU-01	Como viajero, quiero registrarme para tener una cuenta	Valida campos; acepta políticas explícitamente; guarda usuario y aceptación; errores claros	Alta / 5	01,34
HU-02	Como usuario, quiero iniciar/cerrar sesión para proteger mis datos	Contraseña se verifica con bcrypt; JWT válido; rutas protegidas; sesión expira	Alta / 5	02,03,06
HU-03	Como usuario, quiero recuperar acceso para volver a entrar	Solicitud segura; token de recuperación temporal; no revelar si correo existe	Alta / 5	04
HU-04	Como viajero, quiero filtrar lugares para elegir según mis necesidades	Filtros funcionan; resultados relevantes; estados vacíos; mapa y listado coherentes	Alta / 8	07–09
HU-05	Como viajero, quiero conocer la accesibilidad de un lugar para decidir si visitarlo	Cada característica tiene estado, fuente/fecha si disponible; desconocido se distingue	Alta / 8	10,11
HU-06	Como viajero, quiero guardar favoritos para consultarlos después	Solo guarda propios; permite eliminar; no crea duplicados	Alta / 3	12
HU-07	Como viajero, quiero reportar información errónea para mejorar el catálogo	Reporte queda asociado a lugar/autor; moderador puede revisarlo	Alta / 5	13,15
HU-08	Como viajero, quiero reseñar lugares para compartir experiencias	Reseña vinculada a lugar/autor; validaciones; revisión según reglas	Alta / 5	14,15
HU-09	Como viajero, quiero registrar visitas para formar mi pasaporte	Visita se guarda; sello aparece; se identifica como autorregistro	Alta / 5	16,18
HU-10	Como viajero, quiero ganar insignias para reconocer mis exploraciones	Regla verificable; no duplicados; progreso visible	Alta / 5	17,18
HU-11	Como viajero, quiero preguntar sobre cultura para recibir respuestas fundamentadas	Agente devuelve respuesta con referencias o indica falta de información; ejecución registrada	Alta / 8	20,28
HU-12	Como viajero, quiero sugerencias de itinerario para organizar mis días	Recibe días/intereses/presupuesto; propone paradas; no inventa distancias	Alta / 8	21,28
HU-13	Como viajero, quiero consultar accesibilidad con ayuda de IA para entender los datos	Interpreta necesidad; muestra evidencia y desconocidos; no garantiza accesibilidad sin datos	Alta / 5	22,28
HU-14	Como viajero, quiero sugerencias de equipaje para prepararme	Lista según fechas/actividades; indica si clima no disponible	Alta / 5	23,28,29
HU-15	Como viajero, quiero analizar presupuesto para controlar gastos	Clasifica importes; compara; convierte con tasa fechada	Alta / 5	24,28,29
HU-16	Como moderador, quiero detectar reseñas problemáticas para revisarlas	Señala riesgo; moderador decide; registra uso	Alta / 5	25,28
HU-17	Como viajero, quiero un borrador de recuerdos para conservar mi viaje	Usa solo datos autorizados; resultado editable; registra ejecución	Alta / 5	26,28
HU-18	Como responsable de privacidad, quiero detectar datos sensibles en publicaciones para proteger usuarios	Señala posibles datos; no expone contenido a otros roles; decisión humana	Alta / 5	27,28
HU-19	Como usuario, quiero recibir bienvenida tras registrarme para entender la plataforma	Workflow ejecutado desde registro; correo/resultado y errores registrados	Alta / 3	30
HU-20	Como viajero, quiero ver tipo de cambio reciente para planear mis gastos	API real; fecha de actualización; workflow diario; fallback marcado	Alta / 5	29,31
HU-21	Como usuario, quiero eliminar mi cuenta para ejercer control de mis datos	Confirmación de identidad; solicitud y resultado registrados; notificación; retenciones explicadas	Alta / 8	35,32
HU-22	Como auditor, quiero ver bitácoras sin modificarlas para supervisar cumplimiento	Vista solo lectura; controles de rol en backend	Alta / 5	36
HU-23	Como administrador, quiero gestionar lugares y reglas para mantener la plataforma	CRUD autorizado; validaciones; cambios registrados	Alta / 8	19
HU-24	Como viajero, quiero agregar amigos y compartir fotos con permiso para recordar experiencias	Privado por defecto; amistades aceptadas; controles de acceso	Media / 8	38–40
HU-25	Como viajero, quiero crear un viaje con presupuesto para planificarlo	Fechas y paradas guardadas; gastos y equipaje editables	Media / 8	41,42
HU-26	Como negocio, quiero reclamar mi ficha para mantenerla actualizada	Solicitud verificada; cambios no publicados sin revisión	Media / 8	43
HU-27	Como viajero, quiero activar recordatorios para no olvidar viajes	Preferencias propias; aviso según fecha; sin duplicados	Baja / 5	45


E. Tres workflows n8n que se deben entregar
WF-01 — Onboarding [RUTEA-N1; satisface FWD]
- Problema: bienvenida y orientación del usuario nuevo.
- Disparador: evento de registro exitoso enviado por backend a webhook protegido.
- Pasos: verificar evento/identificador → consultar datos mínimos → enviar bienvenida → registrar estado/error.
- Regla crítica: backend registra rol y aceptación de políticas en transacción segura; n8n no decide permisos.
- Prueba: crear usuario → ver registro/consentimiento → comprobar ejecución y resultado del correo.
WF-02 — Tipo de cambio [RUTEA-N1; satisface FWD]
- Problema: evitar actualización manual de conversión monetaria.
- Disparador: programación diaria.
- Pasos: consultar BCCR por servicio backend → validar dato/fecha → guardar tasa → generar resumen → registrar ejecución.
- Prueba: ejecución manual y programada; fecha/tasa visibles; error externo manejado sin inventar tasa.
WF-03 — Eliminación de datos [RUTEA-N1; satisface FWD]
- Problema: tramitar bajas y cumplir privacidad.
- Disparador: solicitud previamente autenticada y confirmada por backend.
- Pasos: verificar estado autorizado → ejecutar servicio seguro de eliminación/anonimización → registrar resultado → notificar.
- Prueba: usuario puede solicitar baja; nadie elimina cuenta ajena; resultado/retención/errores quedan registrados.
Entrega: n8n/*.json importables, documentación por workflow con disparador, pasos, finalidad, credenciales esperadas y evidencia de funcionamiento. Evitar guardar secretos en exportaciones.
F. Contratos de los ocho agentes (resumen)
Todos: entrada validada; permisos según rol; salida útil y no estática; registro en ai_agent_runs; manejo de error/timeout; minimización de datos; documentación de modelo/proveedor y límites.
1. Cultura/RAG: pregunta → respuesta con fuentes del catálogo/documentos.
2. Itinerarios: preferencias/días/presupuesto → plan propuesto; geografía validada por backend.
3. Accesibilidad: necesidad/lugar → explicación con evidencia/fecha/incertidumbre.
4. Maleta/clima: fechas/actividades/clima disponible → lista contextual.
5. Presupuesto: importes/tasa → categorías, comparación y conversión fechada.
6. Moderación: reseña → indicadores de riesgo y sugerencia para revisión humana.
7. Recuerdos: notas/visitas autorizadas → borrador de diario editable.
8. Privacidad: texto público/registro autorizado → alertas de posibles datos personales.
G. Diseño de datos obligatorio
- Diagrama ER: entidades, atributos, PK, FK y cardinalidades.
- Diccionario: tabla, campo, tipo, restricciones, significado.
- Normalización hasta 3FN y tablas puente para N:M.
- Seguridad: usuarios/roles; logs IA e integraciones; gobernanza: versiones, aceptaciones, consentimientos, solicitudes de baja.
- Entidades turísticas/sociales descritas en CONTEXTO_RUTEA.md.
- Scripts SQL reproducibles y seed sin datos personales reales.
H. Seguridad y gobernanza: criterios transversales
- JWT válido y permisos de rol/propiedad para cada ruta sensible.
- bcrypt para contraseñas; secretos en .env, nunca en frontend/GitHub.
- Validar entrada, consultas parametrizadas, errores controlados.
- Consentimiento explícito con versión/fecha y políticas visibles.
- Baja autenticada, eliminación/anonimización según reglas, bitácora y notificación.
- Auditor solo lectura.
- Agentes sin exposición innecesaria de datos personales; proveedores descritos en política.
- Datos de accesibilidad sin inferencias engañosas; ausencia de evidencia significa desconocido.
I. Pruebas mínimas y evidencia
- Validación: campos faltantes, formatos inválidos, fechas y longitudes.
- Auth: login correcto/incorrecto, hash bcrypt, JWT inválido/expirado.
- Roles: cliente no accede a admin/auditor; permisos en servidor.
- Servicios: catálogo/filtros, visitas, insignias, privacidad, baja.
- Agentes: entrada, salida, rol, registro, proveedor fallido (con mocks).
- APIs: éxito, timeout, error, último dato marcado con fecha.
- Workflows: demostración de disparadores, acciones, registro y errores.
- Ejecutar pruebas con un único comando descrito en README.
J. Entregables, fechas y estado
Entregable	Obligatorio	Estado inicial
Anteproyecto completo	Sí [FWD]	Borrador aportado; faltan secciones por completar
Mockups completos + móvil/escritorio	Sí [FWD]	Pendiente de verificar/producir
Libro de marca completo	Sí [FWD]	Pendiente
RF/RNF/HU numerados y cronograma	Sí [FWD]	Propuesta en este archivo; revisar y aprobar
ERD, diccionario, schema.sql, seed.sql	Sí [FWD]	Pendiente
React + Express + SQL + auth/roles	Sí [FWD]	Pendiente de implementación/verificación
Ocho agentes reales con logs	Sí [FWD]	Pendiente de implementación/verificación
API externa real	Sí [FWD]	Proveedor por confirmar
Tres workflows n8n exportados	Sí [FWD]	Pendiente de implementación/verificación
Pruebas, GitHub/ramas/PR y README	Sí [FWD]	Pendiente de implementación/verificación
Privacidad, términos, consentimiento, baja	Sí [FWD]	Pendiente de implementación/verificación
Primer avance	Sí [FWD]	03/12/2026
Segundo avance	Sí [FWD]	09/12/2026
Demostración final	Sí [FWD]	Fecha por confirmar


No marcar funcionalidades como completas sin evidencia real.
K. Reglas para IA desarrolladora
1. Cumplir primero obligaciones [FWD] y Nivel 1; no confundir Nivel 2/futuro con alcance obligatorio.
2. Implementar cada RF con rutas, lógica, BD, interfaz y pruebas pertinentes; registrar qué HU satisface.
3. No sustituir agentes reales por respuestas hardcodeadas ni workflows por diagramas.
4. Nunca exponer secretos ni permitir que n8n evada permisos del backend.
5. No inventar datos turísticos, accesibilidad, fuentes, tarifas ni reservas.
6. Antes de añadir funcionalidades, consultar impacto en tiempo, datos, seguridad y entregables.
7. Actualizar documentación, tests, migraciones y checklist por cada cambio.
8. Mantener los códigos RF/RNF/HU estables; si se agregan, usar consecutivos nuevos.
9. Documentar decisiones y dependencias pendientes en lugar de asumirlas.
L. Incorporaciones y trazabilidad desde el anteproyecto complementado
Fuente: RUTEA_Anteproyecto_Complementado_v1.docx (19/11/2026). Este anexo complementa la matriz anterior. No reemplaza los códigos RF-01…RF-46 ni crea workflows obligatorios adicionales.
Confirmación explícita: los workflows SÍ están incluidos
Los tres flujos obligatorios elegidos por Rutea ya aparecen en la sección E y en los requisitos RF-30, RF-31 y RF-32:
- WF-01 Onboarding: registro confirmado por backend → webhook seguro → correo de bienvenida y registro del resultado. Rol y aceptación de términos se asignan/guardan en el backend durante el registro, no se confía su integridad a un webhook.
- WF-02 Tipo de cambio: programación diaria → consulta BCCR desde integración segura → guardar fecha, fuente y valor → notificar/resumir → registrar errores.
- WF-03 Eliminación: solicitud autenticada y verificada por backend → ejecución idempotente de eliminación/anonimización según política → bitácora → confirmación; jamás permitir que un webhook sin autorización borre cuentas.
La sección E ya documenta disparadores, pasos y entregables. Los recordatorios, recomendaciones y cuarto workflow siguen siendo opcionales, no sustituyen estos tres sin decisión expresa.
Mapeo de códigos del anteproyecto complementado a esta matriz
Importante: las numeraciones son diferentes; se mapean por significado y no por igualdad numérica.
Código en anteproyecto complementado	Tema	Código(s) equivalentes en esta matriz
RF-01 a RF-05	Registro, sesión, roles, perfil, baja	RF-01…RF-07, RF-35
RF-06 a RF-09	Lugares, fuentes, favoritos, correcciones	RF-08…RF-15 (según subfunción)
RF-10 a RF-11	Reseñas y moderación	RF-16…RF-18 (según subfunción)
RF-12 a RF-13	Visitas, sellos, insignias	RF-20…RF-23 (según subfunción)
RF-14	Viaje básico	RF-41, RF-42
RF-15	Reclamo y edición de ficha	RF-43
RF-16	Ocho agentes	RF-24…RF-28 (con desglose en sección F)
RF-17 a RF-18	Tipo de cambio y clima	RF-29 y RF-42 (clima/equipaje), más integración de clima en contexto
RF-19	Tres workflows	RF-30, RF-31, RF-32
RF-20	Administración	RF-19 y RF-36 (según función)


Este mapeo es orientativo, no equivalencia formal 1:1. Revisar descripciones originales antes de enlazar una prueba o HU; no cambiar códigos existentes sin revisar dependencias.
Requisitos de diseño añadidos al proyecto (fuente: libro de marca complementado)
ID adicional	Requisito	Prioridad	Origen
RDIS-01	Usar paleta Azul Ruta #0B2A4A, Turquesa Vivo #12A8A8, Arena Clara #F5F0E6, Verde Bosque #2E6B4B, Carbón #1D252C en tokens CSS	Media	RUTEA / marca
RDIS-02	Aplicar Poppins a títulos y botones e Inter a texto; incluir alternativas de fuente	Media	RUTEA / marca
RDIS-03	Aplicar identidad RUTEA y lema «Tu ruta, tu experiencia»; respetar versiones, márgenes y tamaños mínimos de logo	Media	RUTEA / marca
RDIS-04	Mantener tono cercano y prudente, sin afirmar accesibilidad total sin evidencia	Alta	RUTEA / marca
RDIS-05	Emplear iconografía lineal y fotografía realista respetuosa; no sacrificar contraste ni legibilidad	Media	RUTEA / marca


Inventario de mockups incorporado como criterio de cobertura
Diseñar y revisar P01–P12 descritas en CONTEXTO_RUTEA.md. Para cumplir FWD, ampliar ese inventario hasta cubrir todos los dashboards por rol, cada uno de los ocho agentes, vistas de datos externos, recuperación, consentimientos y baja; principales en móvil/escritorio. El anteproyecto complementado lista pantallas planificadas, no evidencia de diseños ya finalizados.
Requisitos de evidencia y planificación reforzados
- Incorporar cronograma diario del 20/11 al 09/12, más bloque de producción 10–19/12 como planificación del equipo, no como fecha oficial de entrega final.
- Incluir matriz de trazabilidad entre RF/RNF/HU, módulos, pruebas y pantallas.
- Adjuntar schema.sql, seed.sql, ERD, diccionario, .env.example, pruebas, exportaciones n8n, documentación de agentes/APIs, README y URLs/capturas de producción.
- No asumir que el documento complementado contiene todos los anexos completos ni que los mockups existen: verificar artefactos reales antes de marcar completado.