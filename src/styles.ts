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

/** Id of the single style element, which is also how it is recognised again. */
export const STYLE_ELEMENT_ID = "form-display-widget-styles";

/**
 * The widget's stylesheet, MAN CI as specified in the Form-Widget design:
 * radius 0 throughout, hairlines instead of shadows, focus in anthracite
 * `#303c49` (never Staffbase blue), red reserved for the primary CTA, the
 * required marker and the error state. Fonts are the page's own — the MAN
 * intranet ships MAN Europe and Roboto, the stacks here only name them.
 *
 * `--fdw-accent` (plus its hover/active shades) and `--fdw-field-h` are set
 * per block from the configuration, see `FormView`.
 */
export const FORM_DISPLAY_CSS = `
.form-display {
  box-sizing: border-box;
  display: block;
  font-family: 'Roboto', Arial, sans-serif;
  color: #12171c;
  min-width: 0;
}

.form-display *,
.form-display *::before,
.form-display *::after {
  box-sizing: border-box;
}

.form-display__form {
  background: #ffffff;
  border: 1px solid #d6d8db;
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

.form-display__label {
  font: 700 11px/1.4 'MAN Europe', Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #545b62;
}

.form-display__required {
  color: var(--fdw-accent, #e40045);
}

.form-display__image {
  max-width: 100%;
  height: auto;
  border: 1px solid #d6d8db;
}

.form-display__input,
.form-display__textarea,
.form-display__select {
  width: 100%;
  border: 1px solid #d6d8db;
  border-radius: 0;
  background: #ffffff;
  font: 400 15px/1 'Roboto', Arial, sans-serif;
  color: #12171c;
}

.form-display__input {
  height: var(--fdw-field-h, 42px);
  padding: 0 12px;
}

.form-display__textarea {
  padding: 10px 12px;
  line-height: 1.6;
  resize: vertical;
}

.form-display__select-wrap {
  position: relative;
}

.form-display__select {
  height: var(--fdw-field-h, 42px);
  padding: 0 36px 0 12px;
  appearance: none;
  cursor: pointer;
}

.form-display__select-arrow {
  position: absolute;
  right: 13px;
  top: 50%;
  margin-top: -3px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid #303c49;
  pointer-events: none;
}

.form-display__input:focus,
.form-display__textarea:focus,
.form-display__select:focus {
  border-color: #303c49;
  box-shadow: inset 0 0 0 1px #303c49;
  outline: none;
}

.form-display__input:disabled,
.form-display__textarea:disabled,
.form-display__select:disabled {
  border-color: #eeeff0;
  background: #f7f7f8;
  color: #9da3aa;
}

.form-display__input--error,
.form-display__textarea--error,
.form-display__select--error {
  border-color: #c10039;
  border-left: 3px solid #c10039;
}

.form-display__input--date {
  font-variant-numeric: tabular-nums;
}

.form-display__counter {
  font: 400 12px/1.5 'Roboto', Arial, sans-serif;
  color: #9da3aa;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.form-display__helper {
  font: 400 12px/1.5 'Roboto', Arial, sans-serif;
  color: #71787f;
}

.form-display__field-error {
  display: flex;
  gap: 6px;
  align-items: flex-start;
  font: 400 12px/1.5 'Roboto', Arial, sans-serif;
  color: #c10039;
}

.form-display__field-error svg {
  flex: 0 0 13px;
  margin-top: 2px;
}

.form-display__choices {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.form-display__choices--error {
  border-left: 3px solid #c10039;
  padding-left: 10px;
}

.form-display__choice {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 7px 0;
  cursor: pointer;
  font: 400 14px/1.4 'Roboto', Arial, sans-serif;
  color: #12171c;
}

.form-display__choice-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.form-display__choice-box {
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  border: 1px solid #9da3aa;
  background: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.form-display__choice-input:focus-visible + .form-display__choice-box {
  border-color: #303c49;
  box-shadow: inset 0 0 0 1px #303c49;
}

.form-display__choice-core {
  width: 10px;
  height: 10px;
  background: var(--fdw-accent, #e40045);
}

.form-display__choice-check {
  stroke: var(--fdw-accent, #e40045);
}

.form-display__footer {
  padding: 18px 24px;
  border-top: 1px solid #d6d8db;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.form-display__footer-note {
  font: 400 12px/1.5 'Roboto', Arial, sans-serif;
  color: #71787f;
}

.form-display__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-left: auto;
}

/*
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
  margin: 0 !important;
  padding: 0 18px !important;
  white-space: nowrap !important;
  border: 1px solid #303c49 !important;
  border-radius: 0 !important;
  background: #ffffff !important;
  color: #303c49 !important;
  font: 700 13px/1 'MAN Europe', Arial, sans-serif !important;
  text-transform: uppercase !important;
  letter-spacing: 0.04em !important;
  text-decoration: none !important;
  box-shadow: none !important;
  cursor: pointer;
  transition: background 160ms ease-out, color 160ms ease-out, border-color 160ms ease-out;
}

.form-display .form-display__button:hover:not(:disabled) {
  background: #303c49 !important;
  color: #ffffff !important;
}

.form-display .form-display__button--primary {
  padding: 0 22px !important;
  border-color: var(--fdw-accent, #e40045) !important;
  background: var(--fdw-accent, #e40045) !important;
  color: #ffffff !important;
}

.form-display .form-display__button--primary:hover:not(:disabled) {
  background: var(--fdw-accent-hover, #c10039) !important;
  border-color: var(--fdw-accent-hover, #c10039) !important;
  color: #ffffff !important;
}

.form-display .form-display__button--primary:active:not(:disabled) {
  background: var(--fdw-accent-active, #9e002f) !important;
  border-color: var(--fdw-accent-active, #9e002f) !important;
}

.form-display .form-display__button:disabled {
  opacity: 0.55;
  cursor: default;
}

.form-display__answers-cta {
  padding: 0 24px 22px;
}

.form-display__modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  background: rgba(18, 23, 28, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.form-display__modal {
  box-sizing: border-box;
  width: 100%;
  max-width: 560px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #d6d8db;
  font-family: 'Roboto', Arial, sans-serif;
  color: #12171c;
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
  border-bottom: 1px solid #d6d8db;
  background: #f7f7f8;
}

.form-display__modal-title {
  flex: 1 1 auto;
  margin: 0 !important;
  font: 700 13px/1.2 'MAN Europe', Arial, sans-serif !important;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: left !important;
  color: #12171c !important;
}

.form-display__modal .form-display__modal-close {
  width: 32px !important;
  height: 32px !important;
  flex: 0 0 32px;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: none !important;
  color: #303c49 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer;
  transition: color 160ms ease-out;
}

.form-display__modal .form-display__modal-close:hover {
  color: #c10039 !important;
}

.form-display__modal-body {
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-display__answer {
  border: 1px solid #d6d8db;
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
  background: #f7f7f8 !important;
  color: #545b62 !important;
  font: 400 12px/1.4 'Roboto', Arial, sans-serif !important;
  font-variant-numeric: tabular-nums;
  text-align: left !important;
  text-transform: none !important;
  box-shadow: none !important;
  cursor: pointer;
}

.form-display__answer-toggle svg {
  flex: 0 0 12px;
  transition: transform 160ms ease-out;
}

.form-display__answer-toggle[aria-expanded="true"] {
  border-bottom: 1px solid #eeeff0 !important;
}

.form-display__answer-toggle[aria-expanded="true"] svg {
  transform: rotate(180deg);
}

.form-display__answer-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 9px 13px;
  border-bottom: 1px solid #eeeff0;
}

.form-display__answer-row:last-child {
  border-bottom: 0;
}

.form-display__answer-label {
  font: 400 13px/1.4 'Roboto', Arial, sans-serif;
  color: #71787f;
}

.form-display__answer-value {
  font: 400 13px/1.4 'Roboto', Arial, sans-serif;
  color: #12171c;
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

.form-display__success-icon {
  width: 34px;
  height: 34px;
  background: #91b900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.form-display__success-title {
  font: 700 16px/1.25 'MAN Europe', Arial, sans-serif;
  letter-spacing: -0.01em;
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
  font: 400 14px/1.5 'Roboto', Arial, sans-serif;
  color: #71787f;
}

.form-display__notice {
  margin: 0;
  padding: 22px 24px;
  font: 400 14px/1.55 'Roboto', Arial, sans-serif;
  color: #545b62;
}

.form-display__error {
  margin: 0;
  padding: 22px 24px;
  border-left: 3px solid #c10039;
  font: 400 14px/1.55 'Roboto', Arial, sans-serif;
  color: #c10039;
}

.form-display__submit-error {
  flex: 1 1 100%;
  display: flex;
  gap: 6px;
  align-items: flex-start;
  font: 400 12px/1.5 'Roboto', Arial, sans-serif;
  color: #c10039;
}
`;

/**
 * Puts the stylesheet into the document, once.
 *
 * Several forms may sit on one page, and every block would otherwise add its
 * own copy. The id is both the marker and the way back to it.
 */
export function ensureStyles(doc: Document = document): void {
  if (doc.getElementById(STYLE_ELEMENT_ID) !== null) return;
  const style = doc.createElement("style");
  style.id = STYLE_ELEMENT_ID;
  style.textContent = FORM_DISPLAY_CSS;
  doc.head.appendChild(style);
}
