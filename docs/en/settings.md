# Settings

Everything is configured in the **"Select Form"** window, which opens via the
block's configuration dialog. On the left is the list of forms,
and in the center is the selected form and its layout. At the top of the header:
Apply, Cancel, Undo, Help, and the toggle
Editor · Desktop · Tablet · Mobile.

| Setting | Description |
| --- | --- |
| Form | The form to be displayed. Required field—cannot be saved without a form. Selected from the list on the left; the search field above finds forms by title or ID. |
| Accent Color | Color for the Submit button, required indicator, and selection checkbox. Default: MAN Red; alternatively, Anthracite or Black. |
| Density | Standard (40 px field height) or Compact (36 px) — for pages with limited space. |
| Required Indicator | Asterisk (`*`) or the word `(required)` after each required field. |

## To the List of Forms

The list shows only forms that you have created yourself or are authorized to edit
(**administrative rights**), and of those, the 100 most recently modified ones. A
third-party form that you are permitted to embed will therefore not appear there. For this purpose,
there is a section at the bottom of the window labeled **“Enter ID Manually”**: enter the
full form URL there, or the 24-character string at
the end of it. If the list does not load, the section will expand automatically.

## Preview

On desktop, tablet, and mobile, the window displays the actual form at the
respective width, with the settings you’re currently configuring. The layout
is shown to the right of it. Submit, Reset, and “Your previous
submissions” are disabled in the preview; nothing is sent.

## Blocks from Older Versions

Up to version 0.1.0-rc.3, Form, Accent Color, Density, and Required Mark were
separate fields in the dialog. Since then, the window has stored everything in a single field
(`form-display-config`); the old fields are hidden, but their values
still apply.

- An old block looks unchanged until you make a change in the window and
  apply it. Opening and applying without making a change does not write anything.
- When opened, the window applies whatever it can read from the old fields.
  Selection fields cannot always be read in the Content Designer; in that case,
  no option is selected there, and the text **“Not yet selected—until
  then, the block’s previous setting applies.”** appears below. The block retains this
  setting until you select an option.
