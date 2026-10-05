# Form Display

The form viewer brings an existing Staffbase form to a
any page. Readers can fill it out and send it directly there, 
without switching to the form area — for example, on the home page, a
team page or an action page. It is displayed in the MAN CI: angular
Fields, focus in blue, red only for submit button, mandatory field marker
and error messages. 

## What the widget does — and doesn't

It **displays** a form that is already available in the Staffbase form app
is created. It **doesn't** create a form and **doesn't** edit questions. 
Questions, recipients and evaluation remain completely in the form app; the
Widget is only a second output location. 

This means: First create the form in the form app and
, then insert the widget. 

## What readers see

- The questions of the form in the order in which they were created, 
  with mandatory field marking and information texts. 
- The check is only carried out when sending; then the focus jumps to the first
  missing mandatory field. The footer counts open mandatory fields. 
- Once submitted, the Forms app's thank you message replaces the entire
  form. 
- If you have already answered and are not allowed to answer again, you will see the
  form. 
- Is "Allow users to view their previous submissions" in the form app 
  activated, there is a button "Your previous submissions"; if you are no longer
  sees his previous answers directly. 

## Important to know

- Whether someone is allowed to submit (again) is decided by the form app — the widget
  she asks and follows it. 
- Responses run as usual into the evaluation of the form app. It is created
  no separate evaluation per page. 
- The questions appear in the language that the form app uses for the reader
  person; the user interface of the widget is English.