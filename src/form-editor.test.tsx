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
 * Der Rumpf des Fensters „Formular wählen“: Liste links, Kopf und Gestaltung
 * in der Mitte, Inspektor und Vorschau in den Geräteansichten, die Eingabe
 * von Hand. Die Anzeige selbst ist hier ein Platzhalter; was sie in der
 * Vorschau tut, prüft `form-preview.test.tsx`.
 */

import * as React from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfigShellProvider, type ConfigShellState } from "@man/config-ui/shell/shell-context";
import type { EntityOption } from "@shared/entity-picker/entity-catalog";

import type { FormDisplayConfig } from "./form-display-config";
import { FormEditor } from "./form-editor";
import { KEEP_HINT } from "./form-editor-sections";
import type { FormViewProps } from "./form-view";

jest.mock("./form-view", () => {
  const { createElement } = jest.requireActual<typeof React>("react");
  return {
    FormView: (props: FormViewProps) => createElement("div", { "data-testid": "form-display" }, JSON.stringify(props)),
  };
});

const A = "aaaaaaaaaaaaaaaaaaaaaaaa";
const B = "bbbbbbbbbbbbbbbbbbbbbbbb";
const C = "cccccccccccccccccccccccc";

const FORMS: EntityOption[] = [
  { id: A, title: "Anmeldung Betriebsversammlung" },
  { id: B, title: "Bestellung Arbeitskleidung" },
];

const FULL: FormDisplayConfig = { formId: A, accent: "#e40045", density: "standard", requiredMarker: "asterisk" };

const SHELL: ConfigShellState = { view: "editor", setView: () => undefined, preview: true, issuesVisible: false };

interface HarnessProps {
  initial: FormDisplayConfig;
  load: () => Promise<EntityOption[]>;
  onChange: (value: FormDisplayConfig) => void;
  shell: ConfigShellState;
}

/** Hält den Entwurf wie der Rahmen: der Editor ist gesteuert. */
function Harness({ initial, load, onChange, shell }: HarnessProps): React.ReactElement {
  const [value, setValue] = React.useState(initial);
  return (
    <ConfigShellProvider value={shell}>
      <FormEditor
        value={value}
        loadCatalog={load}
        onChange={(next) => {
          onChange(next);
          setValue(next);
        }}
      />
    </ConfigShellProvider>
  );
}

async function renderEditor(
  initial: FormDisplayConfig = {},
  { load = jest.fn().mockResolvedValue(FORMS), shell = SHELL }: { load?: jest.Mock; shell?: Partial<ConfigShellState> } = {},
) {
  const onChange = jest.fn();
  const view = render(<Harness initial={initial} load={load} onChange={onChange} shell={{ ...SHELL, ...shell }} />);
  await act(async () => undefined);
  return { ...view, onChange, load };
}

const list = (): HTMLElement => screen.getByRole("grid", { name: "Formulare" });
const heading = (): HTMLElement => screen.getByTestId("form-heading");
const pill = (group: string, name: string | RegExp): HTMLElement =>
  within(screen.getByRole("radiogroup", { name: group })).getByRole("radio", { name });

describe("FormEditor – Liste", () => {
  it("zeigt die Formulare mit Anzahl, Titel und ID", async () => {
    await renderEditor();

    expect(within(list()).getAllByRole("row")).toHaveLength(2);
    expect(screen.getByText("(2)")).toBeInTheDocument();
    expect(within(list()).getByRole("row", { name: /Anmeldung Betriebsversammlung/ })).toHaveTextContent(A);
    expect(screen.getByText("Nur Formulare, die Sie selbst angelegt haben oder bearbeiten dürfen.")).toBeInTheDocument();
  });

  it("sagt an, dass die Liste lädt", async () => {
    const load = jest.fn(() => new Promise<EntityOption[]>(() => undefined));
    await renderEditor({}, { load });

    expect(screen.getByRole("status")).toHaveTextContent("Formulare werden geladen …");
  });

  it("schreibt das gewählte Formular in den Entwurf und nennt es im Kopf", async () => {
    const { onChange } = await renderEditor({ accent: "#303c49" });
    expect(within(heading()).getByRole("heading", { level: 2 })).toHaveTextContent("Noch kein Formular gewählt");
    expect(heading()).toHaveTextContent("Formular links in der Liste wählen");

    await userEvent.click(screen.getByText("Bestellung Arbeitskleidung"));

    expect(onChange).toHaveBeenLastCalledWith({ formId: B, accent: "#303c49" });
    expect(within(list()).getByRole("row", { name: /Bestellung Arbeitskleidung/ })).toHaveAttribute("aria-selected", "true");
    expect(within(heading()).getByRole("heading", { level: 2 })).toHaveTextContent("Bestellung Arbeitskleidung");
    expect(heading()).toHaveTextContent("Formular · links gewählt");
  });

  it("nennt ein Formular, das nicht in der Liste steht, mit seiner ID", async () => {
    await renderEditor({ formId: C });

    expect(within(heading()).getByRole("heading", { level: 2 })).toHaveTextContent(C);
    expect(heading()).toHaveTextContent("Formular · nicht in der Liste");
  });

  it("filtert nach Titel und ID und leert die Suche mit Escape", async () => {
    await renderEditor();
    const search = screen.getByRole("searchbox", { name: "Formular suchen" });

    fireEvent.change(search, { target: { value: "kleidung" } });
    expect(within(list()).getAllByRole("row")).toHaveLength(1);

    fireEvent.change(search, { target: { value: A.slice(0, 6) } });
    expect(within(list()).getByRole("row")).toHaveTextContent("Anmeldung Betriebsversammlung");

    fireEvent.change(search, { target: { value: "gibt es nicht" } });
    expect(list()).toHaveTextContent("Nichts gefunden zu „gibt es nicht“");

    const escape = fireEvent.keyDown(search, { key: "Escape" });
    expect(escape).toBe(false);
    expect(search).toHaveValue("");
  });

  it("bietet ohne Formulare „Erneut versuchen“ und klappt die Eingabe von Hand auf", async () => {
    const load = jest.fn().mockResolvedValueOnce([]).mockResolvedValueOnce(FORMS);
    await renderEditor({}, { load });

    expect(screen.getByRole("status")).toHaveTextContent("Keine Formulare gefunden");
    expect(screen.getByRole("button", { name: "ID von Hand eintragen" })).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(screen.getByRole("button", { name: "Erneut versuchen" }));

    expect(load).toHaveBeenCalledTimes(2);
    expect(within(list()).getAllByRole("row")).toHaveLength(2);
    // Einmal offen, bleibt es offen.
    expect(screen.getByRole("button", { name: "ID von Hand eintragen" })).toHaveAttribute("aria-expanded", "true");
  });
});

describe("FormEditor – Gestaltung", () => {
  it("zeigt Akzentfarbe, Dichte und Pflichtmarke als Pills mit dem Hinweis zur Pflichtmarke", async () => {
    await renderEditor(FULL);

    expect(pill("Akzentfarbe", "MAN Rot")).toHaveAttribute("aria-checked", "true");
    expect(pill("Dichte", "Standard · 40 px")).toHaveAttribute("aria-checked", "true");
    expect(pill("Pflichtmarke", "*")).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radiogroup", { name: "Pflichtmarke" })).toHaveAccessibleDescription(
      "Steht hinter jedem Pflichtfeld des Formulars.",
    );
    expect(screen.queryByText(KEEP_HINT)).toBeNull();
  });

  it("trägt jede Wahl in den Entwurf ein und lässt die übrigen Schlüssel stehen", async () => {
    const { onChange } = await renderEditor(FULL);

    await userEvent.click(pill("Akzentfarbe", "Anthrazit"));
    expect(onChange).toHaveBeenLastCalledWith({ ...FULL, accent: "#303c49" });

    await userEvent.click(pill("Dichte", "Kompakt · 36 px"));
    expect(onChange).toHaveBeenLastCalledWith({ ...FULL, accent: "#303c49", density: "compact" });

    await userEvent.click(pill("Pflichtmarke", "(required)"));
    expect(onChange).toHaveBeenLastCalledWith({
      ...FULL,
      accent: "#303c49",
      density: "compact",
      requiredMarker: "text",
    });
  });

  it("zeigt die Farben der Akzente als Muster", async () => {
    await renderEditor(FULL);

    const swatch = pill("Akzentfarbe", "Schwarz").querySelector<HTMLElement>("[data-swatch]");
    expect(swatch).toHaveAttribute("aria-hidden", "true");
    expect(swatch?.style.backgroundColor).toBe("rgb(18, 23, 28)");
  });

  // Ein Auswahlfeld des alten Dialogs, das sich nicht lesen ließ: keine Pill
  // gewählt, und der Hinweis sagt, dass bis dahin das alte Feld gilt.
  it("wählt bei einem offenen Schlüssel nichts vor und überschreibt ihn nicht", async () => {
    const { onChange } = await renderEditor({ formId: A, accent: "#303c49" });

    const density = screen.getByRole("radiogroup", { name: "Dichte" });
    expect(within(density).getAllByRole("radio").every((radio) => radio.getAttribute("aria-checked") === "false")).toBe(
      true,
    );
    expect(density).toHaveAccessibleDescription(KEEP_HINT);
    expect(screen.getByRole("radiogroup", { name: "Pflichtmarke" })).toHaveAccessibleDescription(
      `Steht hinter jedem Pflichtfeld des Formulars. ${KEEP_HINT}`,
    );
    expect(onChange).not.toHaveBeenCalled();

    await userEvent.click(pill("Dichte", "Kompakt · 36 px"));
    expect(onChange).toHaveBeenLastCalledWith({ formId: A, accent: "#303c49", density: "compact" });
  });
});

describe("FormEditor – ID von Hand", () => {
  it("übernimmt eine eingefügte Adresse als ID und meldet Unlesbares", async () => {
    const { onChange } = await renderEditor({ accent: "#12171c" });
    await userEvent.click(screen.getByRole("button", { name: "ID von Hand eintragen" }));
    const input = screen.getByRole("textbox", { name: "Formular-ID oder Adresse" });

    fireEvent.change(input, { target: { value: "keine id" } });
    expect(screen.getByText("Keine gültige ID erkannt")).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: `https://www.mti.man/content/form/${C.toUpperCase()}` } });
    expect(onChange).toHaveBeenLastCalledWith({ formId: C, accent: "#12171c" });
    expect(screen.queryByText("Keine gültige ID erkannt")).toBeNull();
  });
});

describe("FormEditor – Prüfung", () => {
  it("meldet das fehlende Formular erst, wenn „Übernehmen“ daran scheiterte", async () => {
    const quiet = await renderEditor();
    expect(screen.queryByRole("alert")).toBeNull();
    quiet.unmount();

    await renderEditor({}, { shell: { issuesVisible: true } });
    expect(within(heading()).getByRole("alert")).toHaveTextContent("Formular auswählen");
  });
});

describe("FormEditor – Geräteansichten", () => {
  it("zeigt im Editor keine Vorschau und keinen Inspektor", async () => {
    await renderEditor(FULL);

    expect(screen.getByTestId("form-editor")).toBeInTheDocument();
    expect(screen.queryByTestId("form-preview")).toBeNull();
    expect(screen.queryByTestId("form-inspector")).toBeNull();
  });

  it("zeigt in Mobil die Vorschau mit dem Entwurf und rechts die Gestaltung ohne Hinweis", async () => {
    const { onChange } = await renderEditor(FULL, { shell: { view: "mobile" } });

    expect(screen.queryByTestId("form-editor")).toBeNull();
    expect(screen.getByRole("region", { name: "Vorschau Mobil" })).toContainElement(screen.getByTestId("form-preview"));
    expect(JSON.parse(screen.getByTestId("form-display").textContent ?? "")).toEqual({
      formId: A,
      accent: "#e40045",
      compact: false,
      requiredMarker: " *",
    });

    const inspector = screen.getByTestId("form-inspector");
    expect(screen.getByRole("heading", { name: "Einstellungen" })).toBeInTheDocument();
    expect(within(inspector).getByRole("heading", { name: "Gestaltung" })).toBeInTheDocument();
    expect(within(inspector).queryByText("Steht hinter jedem Pflichtfeld des Formulars.")).toBeNull();

    await userEvent.click(pill("Dichte", "Kompakt · 36 px"));
    expect(onChange).toHaveBeenLastCalledWith({ ...FULL, density: "compact" });
    expect(JSON.parse(screen.getByTestId("form-display").textContent ?? "")).toMatchObject({ compact: true });
  });

  it("nennt das fehlende Formular im Inspektor, denn dort gibt es keinen Kopf", async () => {
    await renderEditor({}, { shell: { view: "desktop", issuesVisible: true } });

    expect(within(screen.getByTestId("form-inspector")).getByRole("alert")).toHaveTextContent("Formular auswählen");
  });
});
