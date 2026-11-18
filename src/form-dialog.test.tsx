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
 * Das Fenster „Formular wählen“ im gemeinsamen Rahmen von `@man/config-ui`,
 * eingehängt in einen echten RJSF-Dialog: Ausgangsstand aus den alten
 * Feldern, Übernehmen ohne Änderung schreibt nichts, unlesbare Felder bleiben
 * dem alten Attribut, Prüfung, Ausblenden nur im eigenen Dialog, Nachladen
 * des Editors.
 */

import * as React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";

import { modalRoot, settleModal, settleEditor, clickElement } from "@shared/ui/config-modal.testing";
import { configurationSchema } from "./configuration-schema";
import * as client from "./form-client";
import { formEditorShell, startFormDisplayDialog } from "./form-dialog";
import { readFormDisplayConfig, resolveFormDisplay, serializeFormDisplayConfig } from "./form-display-config";
import { STYLE_ELEMENT_ID } from "./styles";

const EDITOR_SELECTOR = '[role="grid"][aria-label="Formulare"] [role="row"]';

const mockEditorLoaded = jest.fn();
jest.mock("./form-editor", () => {
  mockEditorLoaded();
  return jest.requireActual("./form-editor");
});

const A = "aaaaaaaaaaaaaaaaaaaaaaaa";
const B = "bbbbbbbbbbbbbbbbbbbbbbbb";

const localized = (title: string) => ({ config: { localization: { de_DE: { title } } } });

/** Antwortet wie die Formular-App: zwei Formulare mit Verwaltungsrechten. */
function answer(url: string): Response {
  if (url.startsWith("/api/plugins/form/installations/search")) {
    return Response.json({
      entries: [
        { data: { id: A, ...localized("Anmeldung Betriebsversammlung") } },
        { data: { id: B, ...localized("Bestellung Arbeitskleidung") } },
      ],
    });
  }
  return new Response("{}", { status: 404 });
}

beforeEach(() => {
  jest.spyOn(globalThis, "fetch").mockImplementation(async (input) => answer(String(input)));
  jest.spyOn(client, "fetchFormDefinition").mockResolvedValue({
    versionNo: 1,
    fields: [
      { key: "_0", label: "Name", helper: "", image: "", type: "text", required: true, choices: [], maxLength: null },
    ],
  });
  jest.spyOn(client, "fetchFormSettings").mockResolvedValue({
    canUserSubmit: true,
    submissionRestricted: false,
    previousSubmissions: false,
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  document.getElementById(STYLE_ELEMENT_ID)?.remove();
});

const fieldValue = (container: HTMLElement): string =>
  container.querySelector<HTMLInputElement>('#own [id="root_form-display-config"]')!.value;

const inModal = (selector: string): HTMLElement | null => modalRoot()?.querySelector<HTMLElement>(selector) ?? null;

const buttonNamed = (name: string): HTMLElement | null =>
  Array.from(modalRoot()?.querySelectorAll<HTMLElement>('button, [role="radio"]') ?? []).find(
    (button) => button.textContent?.trim() === name || button.getAttribute("aria-label") === name,
  ) ?? null;

const rowNamed = (name: string): HTMLElement | null =>
  Array.from(modalRoot()?.querySelectorAll<HTMLElement>('[role="row"]') ?? []).find((row) =>
    row.textContent?.includes(name),
  ) ?? null;

/** Ein Klick wie von Hilfsmitteln: react-aria nimmt ihn als Druck an. */
const apply = (): Promise<void> => clickElement(inModal('[data-testid="config-shell-apply"]'));

/** Der eigene Dialog neben einem fremden mit gleichen Feldnamen. */
function Dialogs({ own }: { own: React.ReactNode }): React.ReactElement {
  return (
    <>
      <div id="own">{own}</div>
      <form id="foreign">
        <div data-row="density">
          <label htmlFor="root_density">Dichte</label>
          <input id="root_density" defaultValue="loose" />
        </div>
        <div data-row="accent-color">
          <label htmlFor="root_accent-color">Farbe</label>
          <input id="root_accent-color" defaultValue="#00a4fd" />
        </div>
      </form>
    </>
  );
}

async function openWith(own: React.ReactNode): Promise<{ container: HTMLElement; stop: () => void }> {
  const { container } = render(<Dialogs own={own} />);
  let stop = (): void => {};
  await act(async () => {
    stop = startFormDisplayDialog(container);
  });
  await settleEditor(EDITOR_SELECTOR);
  return { container, stop };
}

const open = (formData: Record<string, string>) =>
  openWith(<Form schema={configurationSchema} validator={validator} formData={formData} />);

describe("Nachladen", () => {
  // Muss zuerst laufen: einmal geladen, bleibt das Modul im Speicher.
  it("lädt den Editor erst, wenn ein eigener Dialog erscheint", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const stop = startFormDisplayDialog(container);
    await settleModal();

    expect(mockEditorLoaded).not.toHaveBeenCalled();
    await act(async () => stop());
    container.remove();

    const opened = await open({});
    expect(mockEditorLoaded).toHaveBeenCalledTimes(1);
    expect(inModal('[data-testid="form-editor"]')).not.toBeNull();
    await act(async () => opened.stop());
  });
});

describe("startFormDisplayDialog", () => {
  it("öffnet das Fenster im gemeinsamen Rahmen mit Vorschau-Umschalter und Liste", async () => {
    const { stop } = await open({});

    expect(modalRoot()!.textContent).toContain("Formular-Anzeige");
    expect(modalRoot()!.querySelector("h1")).toHaveTextContent("Formular wählen");
    expect(inModal('[aria-label="Ansicht"]')).not.toBeNull();
    expect(inModal('[role="grid"][aria-label="Formulare"]')).toHaveTextContent("Bestellung Arbeitskleidung");

    await act(async () => stop());
  });

  it("blendet die alten Felder nur im eigenen Dialog aus", async () => {
    const { container, stop } = await open({});

    for (const key of ["form-id", "accent-color", "density", "required-marker"]) {
      const field = container.querySelector(`#own [id="root_${key}"]`);
      expect(field).not.toBeNull();
      expect(field!.closest<HTMLElement>('[style*="display: none"]')).not.toBeNull();
    }
    expect(container.querySelector<HTMLElement>('#foreign [data-row="density"]')?.style.display).toBe("");
    expect(container.querySelector<HTMLElement>('#foreign [data-row="accent-color"]')?.style.display).toBe("");
    expect(container.querySelector<HTMLElement>("#foreign")?.style.display).toBe("");

    await act(async () => stop());
    expect(container.querySelector('#own [id="root_form-id"]')!.closest('[style*="display: none"]')).toBeNull();
  });

  // Öffnen und Übernehmen darf keinen Block verändern.
  it("beginnt mit den alten Feldern und schreibt beim Übernehmen ohne Änderung nichts", async () => {
    const { container, stop } = await open({ "form-id": A, density: "compact" });

    expect(buttonNamed("Kompakt · 36 px")).toHaveAttribute("aria-checked", "true");
    expect(buttonNamed("MAN Rot")).toHaveAttribute("aria-checked", "true");
    expect(rowNamed("Anmeldung Betriebsversammlung")).toHaveAttribute("aria-selected", "true");

    await apply();

    expect(fieldValue(container)).toBe("");
    expect(inModal('[role="status"]')).toHaveTextContent("Keine Änderungen");

    await act(async () => stop());
  });

  it("schreibt beim ersten Übernehmen den ganzen gelesenen Stand nach form-display-config", async () => {
    const { container, stop } = await open({ "form-id": A, density: "compact", "required-marker": "text" });

    await clickElement(buttonNamed("Anthrazit"));
    await apply();

    expect(readFormDisplayConfig(fieldValue(container))).toEqual({
      formId: A,
      accent: "#303c49",
      density: "compact",
      requiredMarker: "text",
    });
    // Die alten Felder bleiben, wie sie sind; es gilt jetzt form-display-config.
    expect(container.querySelector<HTMLInputElement>('#own [id="root_form-id"]')!.value).toBe(A);

    await act(async () => stop());
  });

  it("nimmt eine vorhandene form-display-config vor den alten Feldern", async () => {
    const config = serializeFormDisplayConfig({ formId: B, accent: "#12171c", density: "standard" });
    const { stop } = await open({ "form-display-config": config, "form-id": A, density: "compact" });

    expect(buttonNamed("Schwarz")).toHaveAttribute("aria-checked", "true");
    expect(buttonNamed("Standard · 40 px")).toHaveAttribute("aria-checked", "true");
    expect(rowNamed("Bestellung Arbeitskleidung")).toHaveAttribute("aria-selected", "true");

    await act(async () => stop());
  });

  it("übernimmt nichts ohne Formular und nennt den Fehler", async () => {
    const { container, stop } = await open({});

    await clickElement(buttonNamed("Kompakt · 36 px"));
    await apply();
    expect(fieldValue(container)).toBe("");
    // Ein einzelner Fehler steht im Status mit seiner Meldung.
    expect(inModal('[role="status"]')).toHaveTextContent("Formular auswählen");
    expect(inModal('[data-testid="form-heading"] [role="alert"]')).toHaveTextContent("Formular auswählen");

    await clickElement(rowNamed("Bestellung Arbeitskleidung"));
    await apply();

    expect(readFormDisplayConfig(fieldValue(container))).toMatchObject({ formId: B, density: "compact" });

    await act(async () => stop());
  });

  it("zeigt in der Vorschau den Entwurf, mit Stylesheet im Fenster statt auf der Wirtsseite", async () => {
    const { stop } = await open({ "form-id": A });

    await clickElement(buttonNamed("Mobil"));
    await settleModal();

    expect(inModal('[data-testid="form-preview"]')).toHaveAttribute("inert");
    expect(inModal('[data-testid="form-display"]')).toHaveTextContent("Name");
    expect(inModal('[data-testid="form-inspector"]')).not.toBeNull();
    expect(modalRoot()!.getElementById(STYLE_ELEMENT_ID)).not.toBeNull();
    expect(document.getElementById(STYLE_ELEMENT_ID)).toBeNull();

    await act(async () => stop());
  });

  it("leert mit Escape erst die Suche, statt das Fenster zu schließen", async () => {
    const { stop } = await open({});
    const search = inModal('input[type="search"]') as HTMLInputElement;

    fireEvent.change(search, { target: { value: "kleidung" } });
    await act(async () => {
      fireEvent.keyDown(search, { key: "Escape" });
    });

    expect(search.value).toBe("");
    expect(inModal('[data-testid="config-shell"]')).not.toBeNull();

    await act(async () => stop());
  });
});

// Im Content Designer sind Auswahlfelder keine echten `<select>`: ihr Wert
// ist nicht zu lesen. Ein solcher Schlüssel darf nicht mit der Vorgabe
// überschrieben werden – er bleibt offen, und für die Seite gilt das alte Feld.
describe("unlesbare Auswahlfelder im Content Designer", () => {
  const LEGACY_BLOCK = { "form-id": A, "accent-color": "#12171c", density: "compact", "required-marker": "text" };

  function ContentDesignerForm(): React.ReactElement {
    return (
      <form>
        <div>
          <input id="root_form-display-config" defaultValue="" />
        </div>
        <div>
          <label htmlFor="root_form-id">Formular</label>
          <input id="root_form-id" defaultValue={A} />
        </div>
        <div>
          <label htmlFor="root_accent-color">Akzentfarbe</label>
          <div id="root_accent-color" role="combobox" aria-expanded="false">
            Schwarz
          </div>
        </div>
        <div>
          <label htmlFor="root_density">Dichte</label>
          <div id="root_density" role="combobox" aria-expanded="false">
            Kompakt
          </div>
        </div>
        <div>
          <label htmlFor="root_required-marker">Pflichtfeld-Markierung</label>
          <div id="root_required-marker" role="combobox" aria-expanded="false">
            (required)
          </div>
        </div>
      </form>
    );
  }

  it("wählt sie nicht vor, und Übernehmen ohne Änderung schreibt nichts", async () => {
    const { container, stop } = await openWith(<ContentDesignerForm />);

    expect(rowNamed("Anmeldung Betriebsversammlung")).toHaveAttribute("aria-selected", "true");
    for (const name of ["MAN Rot", "Anthrazit", "Schwarz", "Standard · 40 px", "Kompakt · 36 px"]) {
      expect(buttonNamed(name)).toHaveAttribute("aria-checked", "false");
    }
    expect(inModal('[data-testid="form-editor"]')).toHaveTextContent("bisherige Einstellung des Blocks");

    await apply();
    expect(fieldValue(container)).toBe("");

    await act(async () => stop());
  });

  it("schreibt nur, was gelesen oder gewählt wurde; der Block zeigt das Übrige wie bisher", async () => {
    const { container, stop } = await openWith(<ContentDesignerForm />);

    await clickElement(buttonNamed("Kompakt · 36 px"));
    await apply();

    const written = fieldValue(container);
    expect(readFormDisplayConfig(written)).toEqual({ formId: A, density: "compact" });
    // So liest die Seite den Block danach: Akzent und Marke aus den alten Feldern.
    expect(resolveFormDisplay({ ...LEGACY_BLOCK, "form-display-config": written })).toEqual(
      resolveFormDisplay(LEGACY_BLOCK),
    );

    await act(async () => stop());
  });
});

describe("formEditorShell", () => {
  it("verlangt ein Formular", () => {
    const validate = formEditorShell.validate!;

    expect(validate({ accent: "#303c49" })).toEqual([{ id: "form", message: "Formular auswählen" }]);
    expect(validate({ formId: A })).toEqual([]);
  });

  it("nennt im Status, was sich gegenüber dem übernommenen Stand geändert hat", () => {
    const statusText = formEditorShell.statusText!;

    expect(statusText({ formId: B }, { formId: A })).toBe("Formular gewählt");
    expect(statusText({ formId: A, density: "compact" }, { formId: A })).toBe("Gestaltung geändert");
    expect(statusText({ formId: A }, { formId: A })).toBeUndefined();
  });

  it("erklärt in der Hilfe Liste, Gestaltung, Vorschau, offene Werte und den Weg von Hand", () => {
    const { container } = render(<>{formEditorShell.help}</>);

    expect(container).toHaveTextContent("Die Suche darüber findet Formulare nach Titel oder ID.");
    expect(container).toHaveTextContent("Akzentfarbe");
    expect(container).toHaveTextContent("Absenden ist dort gesperrt");
    expect(container).toHaveTextContent("Noch nicht gewählt");
    expect(container).toHaveTextContent("ID von Hand eintragen");
  });
});
