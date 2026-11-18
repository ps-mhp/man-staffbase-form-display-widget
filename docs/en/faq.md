# FAQ

**A red warning appears under “Forms” in the plugin widget—why?**
This is intentional. The Staffbase plugin widget embeds forms as iframes with a fixed
height. As long as this widget is installed, it displays a warning there and points
to “FormDisplay”—the form belongs directly on the page, in MAN CI.

**The widget displays the message “The form could not be loaded”—why?**
Most often, the form is not (or no longer) published, or the ID points to a
deleted installation. Open the form in the Forms app and compare the ID with the
widget configuration.

**Readers see “You have already submitted this form.”**
This is the “one-time submission” rule of the form, not the widget. Whether
multiple submissions are allowed is specified in the Form App’s
settings.

**Why doesn’t my form appear in the list?**
The list in the “Select Form” window shows only forms with
administrative permissions and, of those, the 100 most recently modified ones. In both cases,
the “Enter ID Manually” section can help: enter the form URL or
the ID there.

**No option is selected for opacity or accent color—is something broken?**
No. The block is from an older version, and the window was unable to read the
old setting in the Content Designer. Until you select an option,
the block’s previous setting remains unchanged.

**Can I submit anything in the window’s preview?**
No. The preview shows the actual form but does not accept any input;
nothing is submitted.

**Are all question types supported?**
Text input, paragraph text, date, drop-down list, single-select, and multi-select
are natively displayed in MAN CI. A question type unknown to the widget
appears as a text field so that the question can still be answered; the widget
does not currently support file uploads.

**In which language does the form appear?**
The form app already displays the questions in the language of the
reader. The widget’s controls (submit, error messages) are
in English, just like in the Events widget.

**Does the response count toward the standard evaluation?**
Yes. The widget sends data to the same Form App; recipient emails, webhooks, and
the response list behave the same way as when the form is filled out in the Form section.
