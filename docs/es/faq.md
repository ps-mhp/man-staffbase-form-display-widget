# Preguntas frecuentes

**En el widget del plugin aparece una advertencia roja en «Formularios»: ¿por qué?**
Es intencionado. El widget del plugin de Staffbase incrusta los formularios como un iframe con
altura fija. Mientras este widget esté instalado, mostrará esa advertencia y remitirá
a «FormDisplay»: el formulario debe estar directamente en la página, en MAN CI.

**El widget muestra el mensaje «The form could not be loaded» — ¿por qué?**
Normalmente, el formulario ya no está publicado o el ID apunta a una
instalación eliminada. Abre el formulario en la aplicación de formularios y compara el ID con la
configuración del widget.

**Los lectores ven «Ya has enviado este formulario».**
Se trata de la regla de «respuesta única» del formulario, no del widget. La
posibilidad de permitir respuestas múltiples se configura en los ajustes de la aplicación de formularios
.

**¿Por qué no aparece mi formulario en la lista de selección?**
La lista solo muestra los formularios con derechos de administración y los últimos
100 modificados. En ambos casos, ayuda introducir la dirección del formulario en
el campo correspondiente.

**¿Se admiten todos los tipos de preguntas?**
Introducción de texto, texto de párrafo, fecha, lista de selección, selección simple y múltiple
se muestran de forma nativa en MAN CI. Un tipo de pregunta desconocido para el widget
aparece como un campo de texto, para que la pregunta se pueda responder; el widget
no admite actualmente la subida de archivos.

**¿En qué idioma aparece el formulario?**
La aplicación de formularios ya proporciona las preguntas en el idioma de la persona
que las lee. Los elementos de control del widget (enviar, mensajes de error) están
en inglés, al igual que en el widget de eventos.

**¿Se tiene en cuenta la respuesta en la evaluación habitual?**
Sí. El widget envía los datos a la misma aplicación de formularios; los correos electrónicos a los destinatarios, los webhooks y
la lista de respuestas se comportan igual que al rellenar el formulario en la sección correspondiente.
