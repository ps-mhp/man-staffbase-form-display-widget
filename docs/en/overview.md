# Form Display

The Form Display feature embeds an existing Staffbase form on any
page. Readers can fill it out and submit it right there,
without having to navigate to the Forms section—for example, on the homepage, a
team page, or a campaign page. It’s displayed in the MAN CI: square
fields, focus in blue, red only for the submit button, required field markers,
and error messages.

## What the widget does—and what it doesn’t

It **displays** a form that has already been created in the Staffbase Form App.
It **does not create** a form and **does not edit** questions.
Questions, recipients, and evaluation remain entirely within the Form App; the
widget is merely a secondary display location.

Consequently: First create and
publish the form in the Form App, then implement the widget.

## What readers see

- The form’s questions in the order they were created,
  with required field indicators and tooltips.
- The form is not validated until it is submitted; afterward, the focus jumps to the first
  missing required field. The footer counts the number of missing required fields.
- After submission, the Form App’s thank-you message replaces the entire
  form.
- Users who have already submitted a response and are not allowed to submit again will see a
  corresponding message instead of the form.
- If “Allow users to view their previous submissions” is
  is enabled, there is a “Your previous submissions” button; users who are no longer
  allowed to submit will see their previous submissions directly.

## Important to Know

- The Form App determines whether a user is allowed to submit (again)—the widget
  queries the Form App and acts accordingly.
- Responses are included in the form app’s analysis as usual. There is
  no separate analysis per page.
- The questions appear in the language that the form app determines for the
  reader; the widget’s user interface is in English.
