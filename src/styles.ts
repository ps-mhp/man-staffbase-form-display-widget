/*!
 * Copyright 2026, MHP Management und IT-Beratung GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ensureStyleElement } from "@shared/style-root";

/** Id of the single style element, which is also how it is recognised again. */
export const STYLE_ELEMENT_ID = "form-display-widget-styles";

/**
 * The widget's stylesheet, MAN CI after Craft, the MAN Design System
 * (component images as in man-theme `src/lib/_craft.scss`, resolved values in
 * man-theme `analysis/craft/components-forms.md`): radius 0 throughout,
 * hairlines instead of shadows, focus as Craft's blue outline (2px `#3875b2`,
 * 2px offset), red reserved for the primary CTA, the required marker and the
 * selection. Errors are Craft's own red (`#cc0000` border, `#990000` text),
 * not the brand red. No capitals and no tracking, as the new MAN CI wants.
 *
 * Plain CSS without Sass, so the `man(...)` helpers are written out: colours
 * and fonts are `var(--man-…, <Craft value>)`, the same pairs as in
 * `@shared/stylings/_man-tokens.scss`. Fonts are the page's own — man-theme
 * ships Man Europe (400, 700) and Man Europe Condensed (700) and names them in
 * `--man-font-body` / `--man-font-head`; without it the stacks fall to Arial.
 *
 * `--fdw-accent` (plus its hover/active shades) and `--fdw-field-h` are set
 * per block from the configuration, see `FormView`.
 */
export const FORM_DISPLAY_CSS = `
.form-display {
  box-sizing: border-box;
  display: block;
  font-family: var(--man-font-body, "Man Europe", Arial, sans-serif);
  color: var(--man-text, #303c49);
  min-width: 0;
}

.form-display *,
.form-display *::before,
.form-display *::after {
  box-sizing: border-box;
}

.form-display__form {
  background: var(--man-surface, #ffffff);
  border: 1px solid var(--man-border, #cbd3dc);
}

.form-display__fields {
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-display__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Craft field-label: Condensed 700 14px/1.3 in the text colour, mixed case. */
.form-display__label {
  font: 700 14px/1.3 var(--man-font-head, "Man Europe Condensed", Arial, sans-serif);
  text-transform: none;
  letter-spacing: normal;
  color: var(--man-text, #303c49);
}

.form-display__required {
  color: var(--fdw-accent, var(--man-red, #e40045));
}

.form-display__image {
  max-width: 100%;
  height: auto;
  border: 1px solid var(--man-border, #cbd3dc);
}

/*
 * Craft input-text: 40px, padding 0 12px, border 1px #5b6f85, radius 0,
 * Man Europe 400 16px. Hover #1e2832, invalid #cc0000 (hover #990000),
 * disabled #e5e5e5 with border and text #afafaf. Focus adds the ring and
 * leaves the border alone.
 */
.form-display__input,
.form-display__textarea,
.form-display__select {
  width: 100%;
  border: 1px solid var(--man-border-input, #5b6f85);
  border-radius: var(--man-radius, 0);
  background: var(--man-surface, #ffffff);
  font: 400 16px/1 var(--man-font-body, "Man Europe", Arial, sans-serif);
  color: var(--man-text, #303c49);
  box-shadow: none;
}

.form-display__input::placeholder,
.form-display__textarea::placeholder {
  color: var(--man-text-muted, #5b6f85);
  opacity: 1;
}

.form-display__input {
  height: var(--fdw-field-h, 40px);
  padding: 0 12px;
}

.form-display__textarea {
  padding: 8px 12px;
  line-height: 1.5;
  resize: vertical;
}

.form-display__select-wrap {
  position: relative;
}

/* Room on the right for the chevron: 12px edge, 16px icon, 20px gap. */
.form-display__select {
  height: var(--fdw-field-h, 40px);
  padding: 0 48px 0 12px;
  appearance: none;
  cursor: pointer;
}

/*
 * Craft select chevron: 16px, in the accent, drawn as two edges of a turned
 * square (man-theme \`chevron\` in \`src/lib/_craft.scss\`).
 */
.form-display__select-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  width: 8px;
  height: 8px;
  margin-top: -4px;
  border: solid var(--fdw-accent, var(--man-red, #e40045));
  border-width: 0 2px 2px 0;
  transform: translateY(-25%) rotate(45deg);
  pointer-events: none;
}

.form-display__input:hover,
.form-display__textarea:hover,
.form-display__select:hover {
  border-color: var(--man-border-input-hover, #1e2832);
}

.form-display__input:focus,
.form-display__textarea:focus,
.form-display__select:focus {
  outline: none;
}

.form-display__input:focus-visible,
.form-display__textarea:focus-visible,
.form-display__select:focus-visible {
  outline: 2px solid var(--man-focus-color, #3875b2);
  outline-offset: 2px;
}

.form-display__input--error,
.form-display__textarea--error,
.form-display__select--error {
  border-color: var(--man-error, #cc0000);
}

.form-display__input--error:hover,
.form-display__textarea--error:hover,
.form-display__select--error:hover {
  border-color: var(--man-error-ink, #990000);
}

.form-display__input:disabled,
.form-display__textarea:disabled,
.form-display__select:disabled {
  border-color: var(--man-grey-400, #afafaf);
  background: var(--man-grey-200, #e5e5e5);
  color: var(--man-text-disabled, #afafaf);
}

.form-display__input--date {
  font-variant-numeric: tabular-nums;
}

/* Craft helper-text: Man Europe 400 12px/1.5, #5b6f85 by default. */
.form-display__counter {
  font: 400 12px/1.5 var(--man-font-body, "Man Europe", Arial, sans-serif);
  color: var(--man-text-muted, #5b6f85);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.form-display__helper {
  font: 400 12px/1.5 var(--man-font-body, "Man Europe", Arial, sans-serif);
  color: var(--man-text-muted, #5b6f85);
}

.form-display__field-error {
  display: flex;
  gap: 6px;
  align-items: flex-start;
  font: 400 12px/1.5 var(--man-font-body, "Man Europe", Arial, sans-serif);
  color: var(--man-error-ink, #990000);
}

.form-display__field-error svg {
  flex: 0 0 13px;
  margin-top: 2px;
}

/* Craft radio group: 12px between the options. */
.form-display__choices {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Craft body-m beside the box, 8px apart. */
.form-display__choice {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font: 400 16px/1.5 var(--man-font-body, "Man Europe", Arial, sans-serif);
  color: var(--man-text, #303c49);
}

.form-display__choice-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

/*
 * Craft checkbox and radio-button: 20px, border 1px #5b6f85 on white, hover
 * #1e2832. The checkbox is square and fills with the accent behind a white
 * check; the radio is round and keeps a 12px accent dot inside a white gap.
 */
.form-display__choice-box {
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  border: 1px solid var(--man-border-input, #5b6f85);
  border-radius: var(--man-radius, 0);
  background: var(--man-surface, #ffffff);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color var(--man-duration, 100ms) var(--man-ease, linear),
    border-color var(--man-duration, 100ms) var(--man-ease, linear);
}

.form-display__choice-input[type="radio"] + .form-display__choice-box {
  border-radius: var(--man-radius-round, 50%);
}

.form-display__choice:hover .form-display__choice-box {
  border-color: var(--man-border-input-hover, #1e2832);
}

.form-display__choice-input:checked + .form-display__choice-box {
  border-color: var(--fdw-accent, var(--man-red, #e40045));
}

.form-display__choice-input[type="checkbox"]:checked + .form-display__choice-box {
  background: var(--fdw-accent, var(--man-red, #e40045));
}

.form-display__choice:hover .form-display__choice-input:checked + .form-display__choice-box {
  border-color: var(--fdw-accent-hover, var(--man-red-hover, #ad0040));
}

.form-display__choice:hover .form-display__choice-input[type="checkbox"]:checked + .form-display__choice-box {
  background: var(--fdw-accent-hover, var(--man-red-hover, #ad0040));
}

.form-display__choice-input:focus-visible + .form-display__choice-box {
  outline: 2px solid var(--man-focus-color, #3875b2);
  outline-offset: 2px;
}

.form-display__choice-core {
  width: 12px;
  height: 12px;
  border-radius: var(--man-radius-round, 50%);
  background: var(--fdw-accent, var(--man-red, #e40045));
}

.form-display__choice:hover .form-display__choice-core {
  background: var(--fdw-accent-hover, var(--man-red-hover, #ad0040));
}

.form-display__choice-check {
  stroke: var(--man-white, #ffffff);
}

/*
 * Craft marks an invalid checkbox (border #cc0000, fill #ffb0b0, label
 * #990000) but has no invalid state on a radio — there the error text below
 * carries it alone.
 */
.form-display__choices--error .form-display__choice-input[type="checkbox"] + .form-display__choice-box {
  border-color: var(--man-error, #cc0000);
}

.form-display__choices--error .form-display__choice-input[type="checkbox"]:not(:checked) + .form-display__choice-box {
  background: var(--man-error-surface, #ffb0b0);
}

.form-display__choices--error .form-display__choice-input[type="checkbox"] + .form-display__choice-box + span {
  color: var(--man-error-ink, #990000);
}

.form-display__footer {
  padding: 18px 24px;
  border-top: 1px solid var(--man-border, #cbd3dc);
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.form-display__footer-note {
  font: 400 12px/1.5 var(--man-font-body, "Man Europe", Arial, sans-serif);
  color: var(--man-text-muted, #5b6f85);
}

.form-display__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-left: auto;
}

/*
 * Craft button m: 40px, padding 0 16px, border 2px, radius 0, Condensed 700
 * 16px, at least 80px wide, mixed case. The plain button is Craft's
 * standard-secondary (white with an anthracite border, hover #cbd3dc), the
 * primary one accent-primary in the configured accent. \`#161616\` is Craft
 * \`man-silver-900\`, which has no \`--man-*\`.
 *
 * Buttons are hardened with !important on their visual core: the widget sits
 * in a page whose theme styles bare button elements (display, width, border,
 * background) and was seen turning these into stacked, borderless text.
 */
.form-display .form-display__button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  width: auto !important;
  height: 40px !important;
  min-width: 80px !important;
  margin: 0 !important;
  padding: 0 16px !important;
  white-space: nowrap !important;
  border: 2px solid var(--man-slate, #303c49) !important;
  border-radius: var(--man-radius, 0) !important;
  background: var(--man-surface, #ffffff) !important;
  color: var(--man-slate, #303c49) !important;
  font: 700 16px/1 var(--man-font-head, "Man Europe Condensed", Arial, sans-serif) !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  text-decoration: none !important;
  box-shadow: none !important;
  cursor: pointer;
  transition:
    color var(--man-duration, 100ms) var(--man-ease, linear),
    background-color var(--man-duration, 100ms) var(--man-ease, linear),
    border-color var(--man-duration, 100ms) var(--man-ease, linear);
}

.form-display .form-display__button:hover:not(:disabled) {
  background: var(--man-border, #cbd3dc) !important;
  border-color: var(--man-slate-700, #1e2832) !important;
  color: var(--man-slate-700, #1e2832) !important;
}

.form-display .form-display__button:active:not(:disabled) {
  background: var(--man-slate-200, #abb6c3) !important;
  border-color: #161616 !important;
  color: #161616 !important;
}

.form-display .form-display__button--primary {
  border-color: var(--fdw-accent, var(--man-red, #e40045)) !important;
  background: var(--fdw-accent, var(--man-red, #e40045)) !important;
  color: var(--man-white, #ffffff) !important;
}

.form-display .form-display__button--primary:hover:not(:disabled) {
  background: var(--fdw-accent-hover, var(--man-red-hover, #ad0040)) !important;
  border-color: var(--fdw-accent-hover, var(--man-red-hover, #ad0040)) !important;
  color: var(--man-white, #ffffff) !important;
}

.form-display .form-display__button--primary:active:not(:disabled) {
  background: var(--fdw-accent-active, var(--man-red-active, #8a003b)) !important;
  border-color: var(--fdw-accent-active, var(--man-red-active, #8a003b)) !important;
  color: var(--man-white, #ffffff) !important;
}

.form-display .form-display__button:disabled {
  background: var(--man-surface, #ffffff) !important;
  border-color: var(--man-grey-400, #afafaf) !important;
  color: var(--man-grey-400, #afafaf) !important;
  cursor: default;
}

.form-display .form-display__button--primary:disabled {
  background: var(--man-grey-200, #e5e5e5) !important;
  border-color: var(--man-grey-200, #e5e5e5) !important;
}

.form-display .form-display__button:focus-visible {
  outline: 2px solid var(--man-focus-color, #3875b2) !important;
  outline-offset: 2px !important;
}

.form-display__answers-cta {
  padding: 0 24px 22px;
}

.form-display__modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  background: var(--man-overlay, rgba(53, 53, 53, 0.6));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

/* Craft modal: white, square and flat, set off by the hairline alone. */
.form-display__modal {
  box-sizing: border-box;
  width: 100%;
  max-width: 560px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: var(--man-surface, #ffffff);
  border: 1px solid var(--man-border, #cbd3dc);
  box-shadow: none;
  font-family: var(--man-font-body, "Man Europe", Arial, sans-serif);
  color: var(--man-text, #303c49);
}

.form-display__modal:focus {
  outline: none;
}

.form-display__modal-head {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--man-border, #cbd3dc);
  background: var(--man-surface-sunken, #f8f8f8);
}

/* An h3 in the host page, which may bring capitals and tracking of its own. */
.form-display__modal-title {
  flex: 1 1 auto;
  margin: 0 !important;
  font: 700 16px/1.3 var(--man-font-head, "Man Europe Condensed", Arial, sans-serif) !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  text-align: left !important;
  color: var(--man-text, #303c49) !important;
}

/* An icon button: no fill on hover or press, only the icon darkens (Craft). */
.form-display__modal .form-display__modal-close {
  width: 32px !important;
  height: 32px !important;
  flex: 0 0 32px;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: none !important;
  color: var(--man-slate, #303c49) !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer;
  transition: color var(--man-duration, 100ms) var(--man-ease, linear);
}

.form-display__modal .form-display__modal-close:hover {
  color: var(--man-slate-700, #1e2832) !important;
}

.form-display__modal .form-display__modal-close:active {
  color: #161616 !important;
}

.form-display__modal .form-display__modal-close:focus-visible {
  outline: 2px solid var(--man-focus-color, #3875b2) !important;
  outline-offset: 2px !important;
}

.form-display__modal-body {
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-display__answer {
  border: 1px solid var(--man-border, #cbd3dc);
}

/* A button, and inside the host page — hardened like the other buttons. */
.form-display__modal .form-display__answer-toggle {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 12px;
  box-sizing: border-box !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 9px 13px !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: var(--man-surface-sunken, #f8f8f8) !important;
  color: var(--man-text-muted, #5b6f85) !important;
  font: 400 12px/1.4 var(--man-font-body, "Man Europe", Arial, sans-serif) !important;
  font-variant-numeric: tabular-nums;
  text-align: left !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  box-shadow: none !important;
  cursor: pointer;
}

.form-display__modal .form-display__answer-toggle:focus-visible {
  outline: 2px solid var(--man-focus-color, #3875b2) !important;
  outline-offset: 2px !important;
}

.form-display__answer-toggle svg {
  flex: 0 0 12px;
  transition: transform var(--man-duration, 100ms) var(--man-ease, linear);
}

.form-display__answer-toggle[aria-expanded="true"] {
  border-bottom: 1px solid var(--man-border-subtle, #eaedf3) !important;
}

.form-display__answer-toggle[aria-expanded="true"] svg {
  transform: rotate(180deg);
}

.form-display__answer-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 9px 13px;
  border-bottom: 1px solid var(--man-border-subtle, #eaedf3);
}

.form-display__answer-row:last-child {
  border-bottom: 0;
}

.form-display__answer-label {
  font: 400 13px/1.4 var(--man-font-body, "Man Europe", Arial, sans-serif);
  color: var(--man-text-muted, #5b6f85);
}

.form-display__answer-value {
  font: 400 13px/1.4 var(--man-font-body, "Man Europe", Arial, sans-serif);
  color: var(--man-text, #303c49);
  text-align: right;
  overflow-wrap: anywhere;
}

.form-display__success {
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

/* Craft success: the green surface with its dark green ink for the check. */
.form-display__success-icon {
  width: 34px;
  height: 34px;
  background: var(--man-success, #dfe9bc);
  color: var(--man-success-ink, #2d6300);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.form-display__success-title {
  font: 700 16px/1.3 var(--man-font-head, "Man Europe Condensed", Arial, sans-serif);
}

.form-display__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.form-display__status {
  margin: 0;
  padding: 22px 24px;
  font: 400 14px/1.5 var(--man-font-body, "Man Europe", Arial, sans-serif);
  color: var(--man-text-muted, #5b6f85);
}

.form-display__notice {
  margin: 0;
  padding: 22px 24px;
  font: 400 14px/1.55 var(--man-font-body, "Man Europe", Arial, sans-serif);
  color: var(--man-text-muted, #5b6f85);
}

.form-display__error {
  margin: 0;
  padding: 22px 24px;
  border-left: 3px solid var(--man-error, #cc0000);
  font: 400 14px/1.55 var(--man-font-body, "Man Europe", Arial, sans-serif);
  color: var(--man-error-ink, #990000);
}

.form-display__submit-error {
  flex: 1 1 100%;
  display: flex;
  gap: 6px;
  align-items: flex-start;
  font: 400 12px/1.5 var(--man-font-body, "Man Europe", Arial, sans-serif);
  color: var(--man-error-ink, #990000);
}
`;

/**
 * Puts the stylesheet where `anchor` lives, once per root.
 *
 * Several forms may sit on one page, and every block would otherwise add its
 * own copy. The id is both the marker and the way back to it.
 *
 * Where that is differs by editor: `document.head` for a classic page, the
 * page's shadow root in the Content Designer — see `@shared/style-root`.
 */
export function ensureStyles(anchor?: Node | null): void {
  ensureStyleElement(anchor, STYLE_ELEMENT_ID, FORM_DISPLAY_CSS);
}
