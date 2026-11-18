# Ajustes

Todo se configura en la ventana **«Seleccionar formulario»**, que se abre junto con el
cuadro de diálogo de configuración del bloque. A la izquierda se encuentra la lista de formularios,
en el centro, el formulario seleccionado y su diseño. En la parte superior, en el encabezado:
Aplicar, Cancelar, Deshacer, Ayuda y el botón de alternancia
Editor · Ordenador · Tableta · Móvil.

| Configuración | Descripción |
| --- | --- |
| Formulario | El formulario que se va a mostrar. Campo obligatorio: sin formulario no se puede aplicar. Se selecciona a la izquierda en la lista; la búsqueda situada encima busca formularios por título o ID. |
| Color de contraste | Color para el botón «Enviar», el indicador de campo obligatorio y la marca de selección. Por defecto, MAN Rojo; alternativamente, antracita o negro. |
| Densidad | Estándar (40 px de altura de campo) o Compacta (36 px) — para páginas con poco espacio. |
| Indicador de campo obligatorio | Asterisco (`*`) o la palabra completa `(required)` detrás de cada campo obligatorio. |

## Lista de formularios

La lista solo muestra los formularios que usted mismo ha creado o que está autorizado a editar
(**derechos de administración**), y de ellos, los 100 modificados más recientemente. Por lo tanto, un
formulario ajeno que usted pueda incrustar no aparecerá allí. Para ello,
en la parte inferior de la ventana hay una sección llamada **«Introducir ID manualmente»**: introduce allí la
dirección completa del formulario o la cadena de 24 caracteres que aparece
al final de la misma. Si la lista no se carga, la sección se despliega automáticamente.

## Vista previa

En ordenador, tableta y móvil, la ventana muestra el formulario real con el
ancho correspondiente, con la configuración que estés ajustando en ese momento. El diseño
aparece a la derecha, junto a él. Los botones «Enviar», «Restablecer» y «Tus envíos
anteriores» están desactivados en la vista previa; no se envía nada.

## Bloques de versiones anteriores

Hasta la versión 0.1.0-rc.3, «Formulario», «Color de acento», «Densidad» y «Marca de obligatoriedad» aparecían como
campos independientes en el cuadro de diálogo. Desde entonces, la ventana guarda todo en un único campo
(`form-display-config`); los campos antiguos están ocultos, pero sus valores
siguen siendo válidos.

- Un bloque antiguo tiene el mismo aspecto hasta que se realiza un cambio en la ventana y
  se aplica. Si se abre y se aplica sin realizar cambios, no se guarda nada.
- Al abrirse, la ventana aplica lo que puede leer de los campos antiguos.
  Los campos de selección no siempre se pueden leer en el Content Designer; en ese caso,
  no hay ninguna opción seleccionada y debajo aparece **«Aún no seleccionado: hasta
  entonces se aplica la configuración anterior del bloque»**. El bloque mantiene esta
  configuración hasta que selecciones una opción.
