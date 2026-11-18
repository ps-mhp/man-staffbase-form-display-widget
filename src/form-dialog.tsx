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
 * Was der Konfigurationsdialog zeigt: ein einziges Fenster „Formular wählen“
 * am Feld `form-display-config`, die einzelnen Felder älterer Fassungen
 * ausgeblendet.
 *
 * Das Fenster beginnt mit `form-display-config` und füllt je Schlüssel auf,
 * was die alten Felder des eigenen Dialogs lesbar tragen – genau das, was
 * die Seite gerade zeigt (`resolveFormDisplay`). Was sich nicht lesen lässt
 * (Auswahlfelder im Content Designer), bleibt offen: es landet nicht im
 * neuen Attribut, und für die Seite gilt weiter das alte Feld. Erst
 * „Übernehmen“ schreibt; ohne Änderung schreibt es nichts.
 */

import * as React from "react";
import { ClipboardList } from "lucide-react";

import { FieldModalShellOptions, startFieldModalInjector } from "@shared/config-modal";

import { FORM_DISPLAY_CONFIG_ATTRIBUTE, LEGACY_ATTRIBUTES } from "./configuration-schema";
import {
  FormDisplayConfig,
  configFromLegacy,
  mergeFormDisplayConfig,
  readFormDisplayConfig,
  serializeFormDisplayConfig,
} from "./form-display-config";
import { formChangesStatus, validateFormDisplayConfig } from "./form-editor-rules";
import { readLegacyFromDialog, startHiddenFields } from "./legacy-fields";

/**
 * Der Editor kommt erst, wenn ein Dialog ihn zeigt: er baut auf
 * `@man/config-ui` und damit auf react-aria. Hier im Seitenbündel bleiben nur
 * Prüfung, Status und Hilfe – sie braucht der Rahmen, bevor der Editor da ist.
 */
const LazyFormEditor = React.lazy(() => import("./form-editor").then((module) => ({ default: module.FormEditor })));

const LOADING = <p className="p-6 text-sm text-muted-foreground">Editor wird geladen …</p>;

/** Tasten und den Satz zu „Übernehmen“ ergänzt der Rahmen selbst. */
const HELP = (
  <ul className="flex list-disc flex-col gap-2 pl-5">
    <li>
      Links das <strong>Formular</strong> wählen. Die Suche darüber findet Formulare nach Titel oder ID.
    </li>
    <li>
      Die Liste zeigt nur Formulare, die Sie selbst angelegt haben oder bearbeiten dürfen – die zuletzt geänderten 100.
    </li>
    <li>
      <strong>Akzentfarbe</strong> färbt Absenden-Button, Pflichtmarke und Auswahl; <strong>Dichte</strong> setzt die
      Feldhöhe auf 40 px oder 36 px; die <strong>Pflichtmarke</strong> steht hinter jedem Pflichtfeld.
    </li>
    <li>
      In Desktop, Tablet und Mobil zeigt die Vorschau das echte Formular; Absenden ist dort gesperrt. Die Gestaltung
      steht dann rechts daneben.
    </li>
    <li>
      Steht bei einer Einstellung <strong>Noch nicht gewählt</strong>, gilt bis zur Wahl die bisherige Einstellung des
      Blocks.
    </li>
    <li>Fehlt ein Formular in der Liste oder lädt sie nicht, lässt sich die ID unter „ID von Hand eintragen“ einfügen.</li>
  </ul>
);

/** Was der gemeinsame Rahmen von der Formular-Anzeige wissen muss. Offengelegt für Tests. */
export const formEditorShell: FieldModalShellOptions<FormDisplayConfig> = {
  widgetName: "Formular-Anzeige",
  title: "Formular wählen",
  icon: ClipboardList,
  preview: true,
  help: HELP,
  statusText: formChangesStatus,
  validate: validateFormDisplayConfig,
};

/**
 * Der Ausgangsstand des Fensters: je Schlüssel `form-display-config`, sonst
 * der lesbare Wert des alten Felds, sonst offen. Offengelegt für Tests.
 */
export function initialConfig(raw: string, root: ParentNode): FormDisplayConfig {
  return mergeFormDisplayConfig(readFormDisplayConfig(raw) ?? {}, configFromLegacy(readLegacyFromDialog(root)));
}

/**
 * Wartet auf den Konfigurationsdialog des Widgets, setzt das Fenster an die
 * Stelle von `form-display-config` und blendet die alten Felder aus – beides
 * nur im eigenen Dialog.
 *
 * @param root der zu beobachtende Teilbaum; standardmäßig das Dokument.
 * Offengelegt, damit Tests den Beobachter auf einen Container begrenzen.
 * @returns eine Funktion, die die Beobachtung beendet und alles abbaut.
 */
export function startFormDisplayDialog(root: ParentNode = document): () => void {
  const stopModal = startFieldModalInjector<FormDisplayConfig>({
    fieldKey: FORM_DISPLAY_CONFIG_ATTRIBUTE,
    root,
    reopenLabel: "Formular wählen",
    modalTestId: "form-editor-modal",
    reopenTestId: "form-editor-reopen",
    parse: (raw) => initialConfig(raw, root),
    serialize: serializeFormDisplayConfig,
    shell: formEditorShell,
    render: ({ value, onChange }) => (
      <React.Suspense fallback={LOADING}>
        <LazyFormEditor value={value} onChange={onChange} />
      </React.Suspense>
    ),
  });
  const stopHiding = startHiddenFields(LEGACY_ATTRIBUTES, FORM_DISPLAY_CONFIG_ATTRIBUTE, root);
  return () => {
    stopModal();
    stopHiding();
  };
}
