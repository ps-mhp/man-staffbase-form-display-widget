# Visualización de formularios

La visualización de formularios permite insertar un formulario existente de Staffbase en
cualquier página. Los lectores pueden rellenarlo y enviarlo directamente desde allí,
sin necesidad de desplazarse a la sección de formularios —por ejemplo, en la página de inicio, en una
página de equipo o una página de campaña. Se muestra con el estilo MAN CI: campos
cuadrados, el foco en antracita, el rojo solo para el botón de envío, indicadores de campos obligatorios
y mensajes de error.

## Qué hace el widget — y qué no hace

**Muestra** un formulario que ya está creado en la aplicación de formularios de Staffbase.
**No crea** ningún formulario ni **edita** ninguna pregunta.
Las preguntas, los destinatarios y la evaluación permanecen íntegramente en la aplicación de formularios; el
widget es solo una segunda vía de visualización.

De ahí se deduce lo siguiente: primero hay que crear y
publicar el formulario en la aplicación de formularios y, a continuación, insertar el widget.

## Lo que ven los lectores

- Las preguntas del formulario en el orden en que se crearon,
  con indicación de los campos obligatorios y textos de ayuda.
- La validación se realiza al enviar el formulario; a continuación, el foco se desplaza al primer
  campo obligatorio que falte. El pie de página cuenta los campos obligatorios pendientes.
- Tras el envío, el mensaje de agradecimiento de la aplicación de formularios sustituye a todo el
  formulario.
- Quien ya haya respondido y no pueda volver a hacerlo, verá, en lugar del
  formulario, un aviso correspondiente.
- Si en la aplicación de formularios está activada la opción «Allow users to view their previous submissions»
  , aparece un botón «Tus envíos anteriores»; quien ya no
  pueda responder, verá directamente sus respuestas anteriores.

## Información importante

- La aplicación de formularios decide si alguien puede volver a enviar el formulario; el widget
  le consulta a la aplicación y se rige por su respuesta.
- Las respuestas se incluyen, como de costumbre, en el análisis de la aplicación de formularios. No se genera
  ningún análisis independiente por página.
- Las preguntas aparecen en el idioma que la aplicación de formularios determina para la persona
  que las lee; la interfaz de usuario del widget está en inglés.
