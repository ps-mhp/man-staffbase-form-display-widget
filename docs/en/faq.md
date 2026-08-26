# FAQ

**A red warning appears under “Forms” in the plugin widget—why?**
Intentional. The Staffbase plugin widget embeds forms as iframes with a fixed
height. As long as this widget is installed, it displays a warning there and refers
to “FormDisplay”—the form belongs directly on the page, in MAN CI.

**The widget displays “The form could not be loaded”—why?**
Most often, the form is not (or no longer) published, or the ID points to a
deleted installation. Open the form in the Forms app and compare the ID with the
widget configuration.

**Readers see “You have already submitted this form.”**
This is the form’s “one-time submission” rule, not the widget’s. Whether
multiple submissions are allowed is specified in the Form App’s
settings.

**Why doesn’t my form appear in the drop-down list?**
The list shows only forms with administrative permissions and the most
recently modified 100. In both cases, pasting the form URL into
the field will help.

**Are all question types supported?**
Text input, paragraph text, date, drop-down list, single-select, and multi-select
are displayed natively in MAN CI. A question type unknown to the widget
appears as a text field so that the question can still be answered; the widget
does not currently support file uploads.

**In which language does the form appear?**
The form app already provides the questions in the language of the person reading
them. The widget’s controls (Submit, error messages) are
in English, just like in the Events widget.

**Does the response count toward the standard evaluation?**
Yes. The widget submits responses to the same Form App; recipient emails, webhooks, and
the response list behave the same way as when filling out the form in the Form section.
