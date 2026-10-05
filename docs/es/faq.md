# Preguntas frecuentes

**En el widget del plugin, aparece una advertencia roja para "Formularios" — ¿por qué?** 
Intent. El widget del plugin Staffbase incrusta formularios como un iframe con fijo
altura. Mientras este widget esté instalado, avisa allí y apunta a
en "FormDisplay" — el formulario pertenece directamente a la página en el CI MAN. 

**El widget dice "El formulario no pudo cargarse" — ¿por qué?** 
En la mayoría de los casos, el formulario no se publica (o ya no se publica) o el ID apunta a un
Instalación eliminada. abre el formulario en la app de Formularios e introduce el ID con el
Compara la configuración de widgets. 

**Los lectores verán "Ya ha enviado este formulario".** 
Esa es la regla de respuesta única del formulario, no el widget. Si
se permiten múltiples respuestas en la configuración de la app Formularios
. 

**¿Por qué no aparece mi formulario en la lista desplegable?** 
La lista muestra solo los formularios con derechos administrativos y los más recientes
Cambiado 100. En ambos casos, insertando la dirección del formulario en
El campo. 

**¿Se admiten todos los tipos de preguntas?** 
Entrada de texto, texto de párrafo, fecha, lista de selección, selección única y múltiple
se muestran de forma nativa en el CI MAN. Un tipo de pregunta desconocido para el widget
aparece como un campo de texto para que la pregunta siga siendo respondible; Subir archivos
actualmente no soporta el widget. 

**¿En qué idioma aparece el formulario?** 
La aplicación de formularios ya proporciona las preguntas en el idioma del lector
Persona. Los controles del widget (enviar, mensajes de error) son
Inglés, como en el widget de Eventos. 

**¿Cuenta la respuesta para la evaluación normal?** 
Sí. El widget envía a la misma aplicación de formularios; correos electrónicos del destinatario, webhooks y
La lista de respuestas se comporta como al rellenar el área del formulario.