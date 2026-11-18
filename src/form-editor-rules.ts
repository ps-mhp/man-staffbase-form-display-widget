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

/**
 * Prüfung und Status des Fensters „Formular wählen“.
 *
 * Liegt im Seitenbündel, nicht beim nachgeladenen Editor: der Rahmen braucht
 * beides schon, bevor der Editor da ist. Darum nur reine Funktionen, nichts
 * aus `@man/config-ui` außer Typen.
 */

import type { ValidationIssue } from "@man/config-ui/shell/shell-context";

import type { FormDisplayConfig } from "./form-display-config";

export const FORM_ISSUE = "form";

/**
 * Was fehlt, damit die Seite ein Formular zeigen kann. Ohne Formular zeigte
 * sie nur „Keine Formular-ID konfiguriert“.
 *
 * Das alte Feld `form-id` ist ein Textfeld und damit immer lesbar: fehlt die
 * ID hier, fehlt sie auch dort.
 */
export function validateFormDisplayConfig(config: FormDisplayConfig): ValidationIssue[] {
  return config.formId === undefined ? [{ id: FORM_ISSUE, message: "Formular auswählen" }] : [];
}

/**
 * Was sich gegenüber dem übernommenen Stand geändert hat – wie bei den
 * anderen Widgets mit Auswahl: „Formular gewählt“, „Gestaltung geändert“.
 */
export function formChangesStatus(draft: FormDisplayConfig, saved: FormDisplayConfig): string | undefined {
  const designChanged =
    draft.accent !== saved.accent || draft.density !== saved.density || draft.requiredMarker !== saved.requiredMarker;
  const parts = [draft.formId !== saved.formId && "Formular gewählt", designChanged && "Gestaltung geändert"].filter(
    (part): part is string => part !== false,
  );
  return parts.length === 0 ? undefined : parts.join(", ");
}
