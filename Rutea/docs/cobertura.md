# Cobertura de Nivel 1

| Requisitos | Funcionalidad | Verificación y límites |
| --- | --- | --- |
| RF-01–RF-06, RF-34 y RF-37 | Registro y versión de políticas, JWT revocable, recuperación de un solo uso, perfil, roles y paneles | Las pruebas HTTP validan registro, revocación, expiración, propiedad y cambio de roles. Para entregar enlaces reales hay que configurar correo y activar n8n. La sesión del navegador vive en memoria. |
| RF-07–RF-13 | Catálogo público con filtros, ficha y mapa por lugar, evidencia granular, favoritos y reportes | Pruebas de API y recorrido en Chrome a 390 px de ancho. La cartografía se carga bajo demanda. Falta ampliar el catálogo con evidencias revisadas. |
| RF-14–RF-15 | Reseñas y reportes con decisiones de moderación | Pruebas HTTP de visibilidad, permisos y aprobación. |
| RF-16–RF-18 | Autorregistro privado de visitas, sello por lugar e insignias por umbral | Prueba de idempotencia y avance. Las insignias se calculan según reglas vigentes. |
| RF-19 | Administrar lugares, fuentes, evidencias de accesibilidad, categorías, reglas y roles | Pruebas de escritura autorizada y rechazo al auditor o viajero. Los lugares se archivan y restauran. |
| RF-20–RF-28 | Ocho asistentes con formularios, contexto, permisos, proveedor configurable y bitácora | Los ocho contratos se prueban con proveedor simulado. Se requiere un modelo autorizado y credenciales para verificar resultados reales. Las distancias del itinerario se calculan en línea recta. |
| RF-29 | Tipo de cambio fechado y pronóstico en el asistente de equipaje | Probados ExchangeRate-API y Open-Meteo en vivo. La consulta al BCCR requiere credencial y se prueba por contrato. |
| RF-30–RF-32 | Tres workflows n8n y endpoints internos con cabecera autenticada | Importados y ejecutados manualmente en n8n 2.38.6 contra endpoints de prueba. El correo, la consulta autenticada al BCCR y la activación en la instancia destino requieren configuración. |
| RF-33–RF-36 | Pantalla legal, baja autenticada, comprobante, notificación y auditoría de solo lectura | Pruebas HTTP de baja y revocación. Los textos vigentes son para la demo. Faltan aprobación de políticas y definición de retención de auditoría para producción. |

La entrega técnica prioriza Nivel 1. Las funciones RF-38–RF-46 de Nivel 2 y propuestas, el anteproyecto final, el libro de marca, los mockups formales y la publicación en GitHub permanecen pendientes.
