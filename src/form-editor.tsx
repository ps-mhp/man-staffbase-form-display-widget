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
 * Der Rumpf des Fensters „Formular wählen“ im gemeinsamen Rahmen von
 * `@man/config-ui`: links die Formulare, in der Mitte Kopf mit dem gewählten
 * Formular und der Abschnitt Gestaltung, in den Geräteansichten die
 * Vorschau. Dort steht die Gestaltung rechts im Inspektor, damit man beim
 * Umschalten weiter einstellen kann und das Ergebnis sofort sieht.
 *
 * Nur im Studio nachgeladen (`form-dialog.tsx`): er bringt react-aria und
 * Tailwind mit, und das hat im Seitenbündel, das jede Leserin lädt, nichts
 * verloren. Kopf, Übernehmen, Rückgängig und Rückfrage kommen vom Rahmen.
 */

import * as React from "react";
import { InspectorPanel } from "@man/config-ui/inspector/inspector-panel";
import { ConfigWorkspace } from "@man/config-ui/layout/config-workspace";
import { useConfigShell } from "@man/config-ui/shell/shell-context";

import { FormCatalog, FormCatalogLoader, formsOf, loadFormCatalog, useFormCatalog } from "./form-catalog-state";
import type { FormDisplayConfig } from "./form-display-config";
import { DesignSection, FormHeading, ManualIdSection } from "./form-editor-sections";
import { FORM_ISSUE, validateFormDisplayConfig } from "./form-editor-rules";
import { FormPreview } from "./form-preview";
import { FormSidebar } from "./form-sidebar";

export interface FormEditorProps {
  value: FormDisplayConfig;
  onChange: (value: FormDisplayConfig) => void;
  /** Woher die Formulare kommen; offengelegt für Tests. */
  loadCatalog?: FormCatalogLoader;
}

interface Labels {
  /** Titel des gewählten Formulars, sonst seine ID. */
  title: string;
  /** Woher das Formular kommt, für die Zeile neben dem Titel. */
  kicker: string;
}

/** Was im Kopf zum Ablesen steht: Titel, wo bekannt, sonst die ID. */
function labelsOf(catalog: FormCatalog, formId: string | undefined): Labels {
  if (formId === undefined) return { title: "", kicker: "" };
  const form = formsOf(catalog.state).find((option) => option.id === formId);
  if (catalog.state.status !== "ready") return { title: formId, kicker: "Formular" };
  return form === undefined
    ? { title: formId, kicker: "Formular · nicht in der Liste" }
    : { title: form.title, kicker: "Formular · links gewählt" };
}

/** Die Meldung zum fehlenden Formular, aber erst, wenn „Übernehmen“ an ihr gescheitert ist. */
function useFormIssue(value: FormDisplayConfig): string | undefined {
  const { issuesVisible } = useConfigShell();
  if (!issuesVisible) return undefined;
  return validateFormDisplayConfig(value).find((issue) => issue.id === FORM_ISSUE)?.message;
}

/**
 * Ob die Eingabe von Hand aufgeklappt beginnt: sobald feststeht, dass die
 * Liste leer ist – dann ist sie der einzige Weg. Einmal offen, bleibt es
 * dabei, auch wenn „Erneut versuchen“ die Liste neu lädt.
 */
function useManualOpen(catalog: FormCatalog): boolean {
  const empty = catalog.state.status === "ready" && catalog.state.forms.length === 0;
  const [open, setOpen] = React.useState(empty);
  React.useEffect(() => {
    if (empty) setOpen(true);
  }, [empty]);
  return open;
}

/** Die Gestaltung knapp, neben der Vorschau – mit der Meldung, denn einen Kopf gibt es dort nicht. */
function PreviewInspector({ value, onChange, issue }: FormEditorProps & { issue: string | undefined }): React.ReactElement {
  return (
    <InspectorPanel title="Einstellungen">
      <div data-testid="form-inspector">
        <DesignSection value={value} onChange={onChange} detailed={false} issue={issue} />
      </div>
    </InspectorPanel>
  );
}

export function FormEditor({ value, onChange, loadCatalog = loadFormCatalog }: FormEditorProps): React.ReactElement {
  const catalog = useFormCatalog(loadCatalog);
  const labels = labelsOf(catalog, value.formId);
  const issue = useFormIssue(value);
  const manualOpen = useManualOpen(catalog);
  // Im Editor steht die Gestaltung in der Mitte; ein Inspektor daneben verdoppelte sie.
  const { view } = useConfigShell();

  const select = (formId: string): void => {
    if (formId !== value.formId) onChange({ ...value, formId });
  };

  return (
    <ConfigWorkspace
      sidebar={<FormSidebar catalog={catalog} selectedId={value.formId} onSelect={select} />}
      preview={<FormPreview config={value} />}
      inspector={view === "editor" ? undefined : <PreviewInspector value={value} onChange={onChange} issue={issue} />}
    >
      <div className="flex max-w-[720px] flex-col gap-8 px-10 pt-6 pb-12" data-testid="form-editor">
        <FormHeading formId={value.formId} title={labels.title} kicker={labels.kicker} issue={issue} />
        <DesignSection value={value} onChange={onChange} detailed />
        <ManualIdSection
          // Neu eingehängt, sobald die Liste leer ankommt: `defaultOpen` gilt nur beim Einhängen.
          key={manualOpen ? "open" : "closed"}
          value={value}
          onChange={onChange}
          defaultOpen={manualOpen}
        />
      </div>
    </ConfigWorkspace>
  );
}
