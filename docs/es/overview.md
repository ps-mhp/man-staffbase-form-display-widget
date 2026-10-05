# Exhibición de Forma

El visor de formularios trae un formulario existente de Staffbase a un
cualquier página. Los lectores pueden rellenarla y enviarla directamente allí, 
sin cambiar al área de formulario — por ejemplo, en la página principal, un
página de equipo o página de acción. Se muestra en el CI MAN: angular
Campos, enfoque en azul, rojo solo para el botón de enviar, marcador de campo obligatorio
y mensajes de error. 

## Lo que hace el widget — y lo que no hace

**Muestra** un formulario que ya está disponible en la aplicación de formularios Staffbase
se crea. No **crea** un formulario y **no** edita preguntas. 
Las preguntas, destinatarios y evaluación permanecen completamente en la aplicación formulario; el
Widget es solo una segunda ubicación de salida. 

Esto significa: Primero crea el formulario en la aplicación de formularios y
, luego inserta el widget. 

## Lo que ven los lectores

- Las preguntas de la forma en el orden en que fueron creadas, 
  con la obligatoriedad de marcar el campo y los textos informativos. 
- La comprobación solo se realiza al enviar; entonces el foco salta al primero
  Falta el campo obligatorio. El pie de pie cuenta campos obligatorios abiertos. 
- Una vez enviado, el mensaje de agradecimiento de la app Forms reemplaza todo el
  forma. 
- Si ya has respondido y no te permiten volver a contestar, verás el
  forma. 
- ¿Permite a los usuarios ver sus envíos anteriores" en la aplicación de formularios 
  activado, hay un botón "Tus envíos anteriores"; si ya no lo estás
  ve sus respuestas anteriores directamente. 

## Importante saberlo

- Si alguien puede enviar (de nuevo) lo decide la aplicación de formulario — el widget
  pregunta y la sigue. 
- Las respuestas se ejecutan como de costumbre en la evaluación de la aplicación de formularios. Se crea
  No hay una evaluación separada por página. 
- Las preguntas aparecen en el idioma que utiliza la aplicación de formulario para el lector
  persona; la interfaz de usuario del widget es en inglés.