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
 * Die Vorschau im Gerätrahmen des Fensters „Formular wählen“: die echte
 * Anzeige mit dem Entwurf, so wie die Seite sie zeigte – samt „Loading form …“
 * und Fehlermeldung, denn das Formular kommt auch hier aus der Formular-App.
 *
 * Ohne Seiteneffekte: die Anzeige liest nur (Fragen, Einstellungen, eigene
 * Antworten), abgesendet wird erst auf Klick. `inert` nimmt der Vorschau
 * Klicks, Tastatur und Fokus – Absenden, Zurücksetzen und „Your previous
 * submissions“ lassen sich hier nicht auslösen. Das Stylesheet landet im
 * Shadow Root des Fensters (`ensureStyles` sucht die Wurzel des Elements),
 * nicht im Kopf der Wirtsseite.
 *
 * Ein Schlüssel ohne Wert – einer, den das Fenster aus dem alten Feld nicht
 * lesen konnte – zeigt hier die Vorgabe; auf der Seite gilt bis zur Wahl
 * weiter das alte Feld. Das sagt der Hinweis unter der Wahl im Inspektor.
 */

import * as React from "react";

import { FormDisplayConfig, displayOf } from "./form-display-config";
import { FormView } from "./form-view";

export function FormPreview({ config }: { config: FormDisplayConfig }): React.ReactElement {
  const display = displayOf(config);
  return (
    <div inert className="p-4" data-testid="form-preview">
      <FormView
        formId={display.formId}
        accent={display.accent}
        compact={display.compact}
        requiredMarker={display.requiredMarker}
      />
    </div>
  );
}
