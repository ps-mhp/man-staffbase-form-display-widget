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

import type { FormDisplayConfig } from "./form-display-config";
import { FORM_ISSUE, formChangesStatus, validateFormDisplayConfig } from "./form-editor-rules";

const A = "aaaaaaaaaaaaaaaaaaaaaaaa";
const B = "bbbbbbbbbbbbbbbbbbbbbbbb";

describe("validateFormDisplayConfig", () => {
  it("verlangt ein Formular, sonst nichts", () => {
    expect(validateFormDisplayConfig({})).toEqual([{ id: FORM_ISSUE, message: "Formular auswählen" }]);
    expect(validateFormDisplayConfig({ accent: "#303c49" })).toHaveLength(1);
    // Offene Gestaltung ist kein Fehler: dann gilt das alte Feld weiter.
    expect(validateFormDisplayConfig({ formId: A })).toEqual([]);
  });
});

describe("formChangesStatus", () => {
  const saved: FormDisplayConfig = { formId: A, accent: "#e40045", density: "standard" };

  it("nennt, was sich gegenüber dem übernommenen Stand geändert hat", () => {
    expect(formChangesStatus({ ...saved, formId: B }, saved)).toBe("Formular gewählt");
    expect(formChangesStatus({ ...saved, density: "compact" }, saved)).toBe("Gestaltung geändert");
    expect(formChangesStatus({ ...saved, requiredMarker: "text" }, saved)).toBe("Gestaltung geändert");
    expect(formChangesStatus({ ...saved, formId: B, accent: "#12171c" }, saved)).toBe(
      "Formular gewählt, Gestaltung geändert",
    );
  });

  it("schweigt ohne Änderung", () => {
    expect(formChangesStatus({ ...saved }, saved)).toBeUndefined();
  });
});
