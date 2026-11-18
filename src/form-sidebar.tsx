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
 * Die linke Spalte im Fenster „Formular wählen“: Kopf „Formulare (n)“, die
 * Suche, die Liste, unten ein Satz, welche Formulare sie zeigt.
 *
 * Jeder Zustand ist zu sehen – Laden, keine Formulare, keine Treffer. Eine
 * stumm leere Spalte sähe aus wie ein kaputtes Fenster. Die Liste kommt aus
 * derselben Quelle wie die bisherige Auswahlliste im Dialog: Formulare mit
 * Verwaltungsrechten, die zuletzt geänderten 100.
 */

import * as React from "react";
import { ClipboardList } from "lucide-react";
import { Button } from "@man/config-ui/primitives/button";
import { ItemList, type ListItem } from "@man/config-ui/sidebar/item-list";
import { SidebarPanel } from "@man/config-ui/sidebar/sidebar-panel";
import { SidebarSearch } from "@man/config-ui/sidebar/sidebar-search";
import type { EntityOption } from "@shared/entity-picker/entity-catalog";

import { FormCatalog, formsOf } from "./form-catalog-state";

export interface FormSidebarProps {
  catalog: FormCatalog;
  selectedId: string | undefined;
  onSelect: (formId: string) => void;
}

const NOTE = "px-3 py-6 text-center text-[13px] text-muted-foreground";
const SEARCH_LABEL = "Formular suchen";

/** Die Formulare, deren Titel oder ID die Suche enthält. */
export function filterForms(forms: readonly EntityOption[], query: string): readonly EntityOption[] {
  const needle = query.trim().toLocaleLowerCase();
  if (needle === "") return forms;
  return forms.filter((form) => form.title.toLocaleLowerCase().includes(needle) || form.id.includes(needle));
}

/** Das Kennzeichen vor jeder Zeile, wie im Kopf des Fensters. */
const FORM_KIND = <ClipboardList className="size-[18px] text-muted-foreground" aria-hidden />;

/**
 * Titel und darunter die ID: zwei Formulare mit gleichem Titel bleiben so
 * unterscheidbar, und die ID lässt sich mit der Formular-Adresse vergleichen.
 */
function itemsOf(forms: readonly EntityOption[]): ListItem[] {
  return forms.map((form) => ({
    id: form.id,
    label: form.title,
    description: form.title === form.id ? "Ohne Titel" : form.id,
    thumbnail: FORM_KIND,
  }));
}

/** Keine Formulare: entweder gibt es keine mit Verwaltungsrechten, oder die Liste kam nicht an. */
function EmptyNote({ onRetry }: { onRetry: () => void }): React.ReactElement {
  return (
    <div className="flex flex-col items-center gap-3 px-3 py-6 text-center">
      <p role="status" className="text-[13px] text-muted-foreground">
        Keine Formulare gefunden – oder die Liste konnte nicht geladen werden. Die ID lässt sich auch unter „ID von Hand
        eintragen“ einfügen.
      </p>
      <Button type="button" variant="outline" size="sm" className="h-10" onClick={onRetry}>
        Erneut versuchen
      </Button>
    </div>
  );
}

function FormList({ catalog, selectedId, onSelect, query }: FormSidebarProps & { query: string }): React.ReactElement {
  const forms = formsOf(catalog.state);
  const items = React.useMemo(() => itemsOf(filterForms(forms, query)), [forms, query]);

  if (catalog.state.status === "loading") {
    return (
      <p role="status" className={NOTE}>
        Formulare werden geladen …
      </p>
    );
  }
  if (forms.length === 0) return <EmptyNote onRetry={catalog.reload} />;
  return (
    <ItemList
      aria-label="Formulare"
      items={items}
      selectedId={selectedId ?? null}
      onSelect={onSelect}
      emptyState={`Nichts gefunden zu „${query.trim()}“`}
    />
  );
}

export function FormSidebar(props: FormSidebarProps): React.ReactElement {
  const { state } = props.catalog;
  const [query, setQuery] = React.useState("");
  const forms = formsOf(state);
  return (
    <SidebarPanel
      title="Formulare"
      count={state.status === "ready" ? forms.length : undefined}
      footer={
        <p className="text-[13px] leading-[1.45] text-muted-foreground">
          Nur Formulare, die Sie selbst angelegt haben oder bearbeiten dürfen.
        </p>
      }
    >
      {forms.length > 0 && <SidebarSearch aria-label={SEARCH_LABEL} value={query} onValueChange={setQuery} />}
      <FormList {...props} query={query} />
    </SidebarPanel>
  );
}
