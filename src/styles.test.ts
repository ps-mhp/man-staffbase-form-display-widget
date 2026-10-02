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

import { FORM_DISPLAY_CSS } from "./styles";

/** The declarations of the first rule whose selector list is exactly `selector`. */
const rule = (selector: string): string => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`(?:^|}|\\*/)\\s*${escaped}\\s*\\{([^}]*)\\}`).exec(FORM_DISPLAY_CSS);
  return match === null ? "" : match[1];
};

/** Every value of `property` in the sheet. */
const values = (property: string): string[] =>
  [...FORM_DISPLAY_CSS.matchAll(new RegExp(`(?:^|[;{\\s])${property}:\\s*([^;]+);`, "gm"))].map((match) => match[1].trim());

const FOCUS_RING = /outline:\s*2px solid var\(--man-focus-color, #3875b2\)/;

// Craft, the MAN Design System (man-theme `src/lib/_craft.scss`), and the
// new MAN CI on top of it: no capitals, no tracking, two faces.
describe("form stylesheet after Craft", () => {
  it("sets nothing in capitals and tracks nothing", () => {
    expect(FORM_DISPLAY_CSS).not.toMatch(/uppercase/);
    expect(values("letter-spacing").length).toBeGreaterThan(0);
    expect(values("letter-spacing").every((value) => /^normal( !important)?$/.test(value))).toBe(true);
  });

  it("names its faces only through the MAN font tokens, at 400 or 700", () => {
    expect(FORM_DISPLAY_CSS).not.toMatch(/MANEurope|Roboto|'MAN Europe'/);
    expect(values("font").length).toBeGreaterThan(0);
    for (const value of [...values("font"), ...values("font-family")]) {
      expect(value).toMatch(/var\(--man-font-(head|body), "Man Europe( Condensed)?", Arial, sans-serif\)/);
    }
    for (const value of values("font")) expect(value).toMatch(/^(400|700) /);
  });

  it("keeps the old pre-Craft colours out", () => {
    expect(FORM_DISPLAY_CSS).not.toMatch(
      /#c10039|#9e002f|#12171c|#545b62|#71787f|#9da3aa|#d6d8db|#eeeff0|#f7f7f8|#91b900|rgba\(18, 23, 28/i,
    );
  });

  it("casts no shadows", () => {
    expect(values("box-shadow").length).toBeGreaterThan(0);
    expect(values("box-shadow").every((value) => /^none( !important)?$/.test(value))).toBe(true);
  });

  it("labels fields like Craft's field-label", () => {
    const label = rule(".form-display__label");
    expect(label).toMatch(/font:\s*700 14px\/1\.3 var\(--man-font-head/);
    expect(label).toMatch(/text-transform:\s*none/);
    expect(label).toMatch(/color:\s*var\(--man-text, #303c49\)/);
  });

  it("draws fields like Craft's input-text", () => {
    const field = rule(".form-display__input,\n.form-display__textarea,\n.form-display__select");
    expect(field).toMatch(/border:\s*1px solid var\(--man-border-input, #5b6f85\)/);
    expect(field).toMatch(/font:\s*400 16px\/1 var\(--man-font-body/);
    expect(rule(".form-display__input")).toMatch(/height:\s*var\(--fdw-field-h, 40px\)/);
    expect(rule(".form-display__input--error,\n.form-display__textarea--error,\n.form-display__select--error")).toMatch(
      /border-color:\s*var\(--man-error, #cc0000\)/,
    );
  });

  it("gives choices Craft's 20 px box, round for radio", () => {
    expect(rule(".form-display__choice-box")).toMatch(/width:\s*20px/);
    expect(rule('.form-display__choice-input[type="radio"] + .form-display__choice-box')).toMatch(
      /border-radius:\s*var\(--man-radius-round, 50%\)/,
    );
    expect(rule(".form-display__choice-core")).toMatch(/width:\s*12px/);
  });

  it("builds the buttons as Craft button m", () => {
    const button = rule(".form-display .form-display__button");
    expect(button).toMatch(/height:\s*40px !important/);
    expect(button).toMatch(/border:\s*2px solid/);
    expect(button).toMatch(/font:\s*700 16px\/1 var\(--man-font-head/);
    expect(button).toMatch(/text-transform:\s*none !important/);
  });

  it("shows focus as Craft's blue outline, never as a shadow", () => {
    for (const selector of [
      ".form-display__input:focus-visible,\n.form-display__textarea:focus-visible,\n.form-display__select:focus-visible",
      ".form-display__choice-input:focus-visible + .form-display__choice-box",
      ".form-display .form-display__button:focus-visible",
      ".form-display__modal .form-display__modal-close:focus-visible",
      ".form-display__modal .form-display__answer-toggle:focus-visible",
    ]) {
      expect(rule(selector)).toMatch(FOCUS_RING);
      expect(rule(selector)).toMatch(/outline-offset:\s*2px/);
    }
  });
});
