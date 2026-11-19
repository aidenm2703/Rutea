# Integraciones y automatizaciones

## n8n

Importa los tres JSON de `n8n/`. Crea una credencial Header Auth llamada **Rutea Workflow Header**, con nombre de cabecera `X-Workflow-Secret` y el valor de `WORKFLOW_SECRET`. Selecciona esa credencial en el webhook y en cada nodo HTTP. Sustituye `http://host.docker.internal:3000` si n8n y el backend usan otra red. Activa los workflows y copia la URL de producción del webhook de registro en `N8N_WELCOME_WEBHOOK`.

| Flujo | Disparador | Pasos y verificación |
| --- | --- | --- |
| Bienvenida y recuperación | Webhook autenticado al registrar, programación cada minuto y ejecución manual | El backend crea cuenta, aceptación y trabajo de bienvenida en una sola transacción. El webhook intenta procesar el correo. La programación toma los pendientes de bienvenida y recuperación. Verifica el correo y la bitácora. |
| Tipo de cambio | Diario a las 08:00 en Costa Rica y ejecución manual | El backend solicita los indicadores de compra y venta, guarda ambos juntos y devuelve el resumen. Verifica fechas, fuente y estado en la pantalla de tipo de cambio. |
| Eliminación | Programación cada minuto y ejecución manual | El backend verifica contraseña y confirmación, elimina en una transacción y crea un comprobante y una notificación. n8n solo pide procesar la notificación ya autorizada. Verifica la revocación de sesión, el comprobante y el correo. |

La cola reserva cada trabajo cinco minutos. Resend recibe un identificador de idempotencia por mensaje. Si el proveedor acepta el envío, el backend elimina el destinatario y registra el resultado. Los fallos dejan el trabajo disponible al vencer la reserva. El plazo máximo del mensaje es de 24 horas, y el enlace de recuperación vence a los 30 minutos. Ejecuta los workflows de forma continua para limpiar la cola.

## Proveedores externos

- **BCCR** usa compra 317 y venta 318. Configura `BCCR_NAME`, `BCCR_EMAIL` y `BCCR_TOKEN`. El servidor conserva el último dato válido y muestra su fecha. [Servicio de indicadores](https://gee.bccr.fi.cr/Indicadores/Suscripciones/UI/ConsultaIndicadores)
- **ExchangeRate-API** ofrece una referencia de mercado USD/CRC cuando todavía no hay datos del BCCR. Actualiza como máximo una vez al día si tiene una respuesta válida. La interfaz muestra atribución y distingue una respuesta almacenada si falla una consulta posterior. [Documentación del endpoint abierto](https://www.exchangerate-api.com/docs/free)
- **Open-Meteo** recibe las coordenadas de la ficha pública y devuelve datos diarios para el asistente de equipaje. La integración usa el endpoint para uso no comercial y muestra la fuente en el resultado. [Documentación del pronóstico](https://open-meteo.com/en/docs)
- **Resend** envía las notificaciones con un remitente verificado. Configura `RESEND_API_KEY` y `MAIL_FROM` en el backend. [Idempotencia de correos](https://resend.com/blog/engineering-idempotency-keys)
- **OpenStreetMap** se carga cuando se solicita ver el mapa de una ficha. [Guía de mapas incrustados](https://wiki.openstreetmap.org/wiki/Export_tab)

## Asistentes

Configura `AI_CHAT_URL` con la URL HTTPS completa de Chat Completions del proveedor elegido, `AI_API_KEY` y `AI_MODEL`. El contrato devuelve texto y fuentes aplicables. El sistema pide autorización antes de enviar la consulta, intenta omitir correos y números personales, y guarda únicamente identificador de usuario, asistente, estado, fecha y duración. La omisión por patrones tiene cobertura limitada.

| Asistente | Roles | Entrada y salida |
| --- | --- | --- |
| Cultura | Viajero, moderador, administrador | Pregunta y búsqueda sobre fichas. Respuesta fundamentada con fuentes. |
| Itinerario | Viajero, moderador, administrador | Días, intereses, necesidades y presupuesto. Propuesta basada en las fichas recuperadas. |
| Accesibilidad | Viajero, moderador, administrador | Lugar y necesidad. Explicación de estados y evidencia. |
| Maleta y clima | Viajero, moderador, administrador | Lugar, fechas y actividades. Equipaje y días disponibles en el pronóstico. |
| Presupuesto | Viajero, moderador, administrador | Importes y monedas. Resumen respaldado por el tipo de cambio cuando está disponible. |
| Moderación | Moderador, administrador | Texto público. Señales para revisión humana. |
| Diario | Viajero, moderador, administrador | Notas autorizadas. Borrador editable. |
| Privacidad | Moderador, administrador, auditor | Texto público. Categorías de posibles datos personales para revisión humana. |
