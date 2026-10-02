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

/**
 * Schema for the widget's configuration dialog.
 *
 * The keys are byte-identical to the declared attributes and to the entry in
 * `widgets.json`: the host saves a value under its schema key verbatim and
 * reads it back off the element under the declared attribute name, and it
 * drops an attribute it was never told about.
 *
 * The three appearance fields mirror the tweaks of the Form-Widget design:
 * accent, density and the spelling of the required marker.
 *
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/
 */
export const configurationSchema: JSONSchema7 = {
  properties: {
    "form-id": {
      type: "string",
      title: "Formular",
    },
    "accent-color": {
      type: "string",
      title: "Akzentfarbe",
      default: "#e40045",
      oneOf: [
        { const: "#e40045", title: "MAN Rot" },
        { const: "#303c49", title: "Anthrazit" },
        { const: "#12171c", title: "Schwarz" },
      ],
    },
    density: {
      type: "string",
      title: "Dichte",
      default: "standard",
      oneOf: [
        { const: "standard", title: "Standard (40 px)" },
        { const: "compact", title: "Kompakt (36 px)" },
      ],
    },
    "required-marker": {
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

/**
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema
 */
export const uiSchema: UiSchema = {
  "form-id": {
    "ui:help":
      "ID der Formular-Installation — die 24-stellige Zeichenfolge am Ende der Formular-URL. " +
      "Die vollständige URL kann ebenfalls eingefügt werden.",
  },
  "accent-color": {
    "ui:help": "Farbe für Absenden-Button, Pflichtfeld-Marker und Auswahl-Häkchen.",
  },
  density: {
    "ui:help": "Kompakt reduziert die Feldhöhe von 40 auf 36 px.",
  },
  "required-marker": {
    "ui:help": "Wie Pflichtfelder im Label gekennzeichnet werden.",
  },
};
