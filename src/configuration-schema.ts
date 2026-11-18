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

import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

// Die Namen der Konfiguration.
//
// Jeder steht an drei Stellen gleich geschrieben: als Schlüssel im Schema,
// als Attribut, das dem Host gemeldet wird, und als Name, unter dem die
// Ansicht liest. Es sind auch die Attribute dieses Widgets in `widgets.json`:
// der Host speichert einen Wert wörtlich unter seinem Schema-Schlüssel, liest
// ihn unter dem gemeldeten Attribut zurück und verwirft ein Attribut, das ihm
// nie genannt wurde.

/** Die ganze Konfiguration in einem Feld – siehe `form-display-config.ts`. */
export const FORM_DISPLAY_CONFIG_ATTRIBUTE = "form-display-config";
export const FORM_ID_ATTRIBUTE = "form-id";
export const ACCENT_COLOR_ATTRIBUTE = "accent-color";
export const DENSITY_ATTRIBUTE = "density";
export const REQUIRED_MARKER_ATTRIBUTE = "required-marker";

/**
 * Die einzelnen Felder bis 0.1.0-rc.3. Sie stehen weiter im Schema, damit der
 * Dialog ihre Werte führt und alte Blöcke sie behalten: was das Fenster beim
 * Öffnen lesen kann, übernimmt es als Ausgangsstand; was nicht, gilt weiter
 * aus dem alten Feld. Zu sehen sind sie im eigenen Dialog nicht mehr
 * (`@shared/legacy-fields`).
 */
export const LEGACY_ATTRIBUTES = [
  FORM_ID_ATTRIBUTE,
  ACCENT_COLOR_ATTRIBUTE,
  DENSITY_ATTRIBUTE,
  REQUIRED_MARKER_ATTRIBUTE,
] as const;

/**
 * Schema des Konfigurationsdialogs.
 *
 * Zu sehen ist nur `form-display-config`: an seine Stelle tritt das Fenster
 * „Formular wählen“, in dem alles gepflegt wird (`form-dialog.tsx`). Die
 * übrigen Felder sind die der Fassungen bis 0.1.0-rc.3, unverändert – auch
 * ihre Vorgaben, denn RJSF schreibt sie beim Speichern in jeden Block.
 *
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/
 */
export const configurationSchema: JSONSchema7 = {
  properties: {
    [FORM_DISPLAY_CONFIG_ATTRIBUTE]: {
      type: "string",
      title: "Formular-Anzeige",
      default: "",
    },
    [FORM_ID_ATTRIBUTE]: {
      type: "string",
      title: "Formular",
    },
    [ACCENT_COLOR_ATTRIBUTE]: {
      type: "string",
      title: "Akzentfarbe",
      default: "#e40045",
      oneOf: [
        { const: "#e40045", title: "MAN Rot" },
        { const: "#303c49", title: "Anthrazit" },
        { const: "#12171c", title: "Schwarz" },
      ],
    },
    [DENSITY_ATTRIBUTE]: {
      type: "string",
      title: "Dichte",
      default: "standard",
      oneOf: [
        { const: "standard", title: "Standard (40 px)" },
        { const: "compact", title: "Kompakt (36 px)" },
      ],
    },
    [REQUIRED_MARKER_ATTRIBUTE]: {
      type: "string",
      title: "Pflichtfeld-Markierung",
      default: "asterisk",
      oneOf: [
        { const: "asterisk", title: "Sternchen (*)" },
        { const: "text", title: "(required)" },
      ],
    },
  },
};

/** Alle Attribute, in der Reihenfolge des Schemas: das neue zuerst. */
export const ALL_ATTRIBUTES: string[] = Object.keys(configurationSchema.properties ?? {});

/**
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema
 */
export const uiSchema: UiSchema = {
  [FORM_DISPLAY_CONFIG_ATTRIBUTE]: {
    "ui:help":
      "Formular und Gestaltung werden im Fenster „Formular wählen“ gepflegt; " +
      "das Textfeld dahinter ist die Rohfassung.",
  },
};
