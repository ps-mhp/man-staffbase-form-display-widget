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
 * Die Liste der Formulare im Fenster „Formular wählen“: laden, neu laden.
 *
 * `fetchEntityCatalog` wirft nie – ein Fehler kommt als leere Liste an. Darum
 * kennt der Zustand nur „lädt“ und „da“; eine leere Liste sagt die
 * Seitenleiste als „keine gefunden oder nicht geladen“ an und bietet
 * „Erneut versuchen“ und die Eingabe von Hand.
 */

import * as React from "react";
import { EntityOption, fetchEntityCatalog } from "@shared/entity-picker/entity-catalog";

import { formCatalogSource } from "./form-catalog";

export type FormCatalogLoader = () => Promise<EntityOption[]>;

export type FormCatalogState = { status: "loading" } | { status: "ready"; forms: readonly EntityOption[] };

export interface FormCatalog {
  state: FormCatalogState;
  reload: () => void;
}

/** Was das Widget wirklich lädt: die Formulare mit Verwaltungsrechten. */
export const loadFormCatalog: FormCatalogLoader = () => fetchEntityCatalog(formCatalogSource);

const NO_FORMS: readonly EntityOption[] = [];

export function useFormCatalog(load: FormCatalogLoader = loadFormCatalog): FormCatalog {
  const [state, setState] = React.useState<FormCatalogState>({ status: "loading" });
  const [round, setRound] = React.useState(0);

  React.useEffect(() => {
    // Ein neuer Ladelauf macht das Ergebnis des alten bedeutungslos.
    let current = true;
    setState({ status: "loading" });
    load()
      .then((forms) => {
        if (current) setState({ status: "ready", forms });
      })
      .catch(() => {
        if (current) setState({ status: "ready", forms: NO_FORMS });
      });
    return () => {
      current = false;
    };
  }, [load, round]);

  const reload = React.useCallback(() => setRound((value) => value + 1), []);
  return { state, reload };
}

/** Die Formulare, sobald geladen; sonst leer. */
export const formsOf = (state: FormCatalogState): readonly EntityOption[] =>
  state.status === "ready" ? state.forms : NO_FORMS;
