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

import {
  HIDDEN_ROW_MARKER,
  ROW_SELECTOR,
  startPluginBlockGuard,
  warningText,
  WARNING_CLASS,
} from "./plugin-block-guard";

const ROW_CLASS = ROW_SELECTOR.slice(1);

interface Dialog {
  form: HTMLFormElement;
  input: HTMLInputElement;
  pluginRow: HTMLElement;
  otherRows: HTMLElement[];
}

/**
 * The dialog as the plugin-block renders it, reduced to what matters here:
 * one form whose first settings row carries the hidden `pluginType` field,
 * followed by the rows that only make sense for the selected plugin.
 */
function renderDialog(container: HTMLElement, value: string): Dialog {
  const form = document.createElement("form");

  const pluginRow = document.createElement("div");
  pluginRow.className = ROW_CLASS;
  const input = document.createElement("input");
  input.name = "pluginType";
  input.type = "hidden";
  input.value = value;
  pluginRow.appendChild(input);
  form.appendChild(pluginRow);

  const otherRows = ["form", "height-desktop", "height-mobile"].map((name) => {
    const row = document.createElement("div");
    row.className = ROW_CLASS;
    row.dataset.row = name;
    form.appendChild(row);
    return row;
  });

  container.appendChild(form);
  return { form, input, pluginRow, otherRows };
}

function flushObserver(): Promise<void> {
  // MutationObserver callbacks run as microtasks; one tick settles them.
  return Promise.resolve();
}

describe("startPluginBlockGuard", () => {
  let container: HTMLElement;
  let stop: (() => void) | null = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    stop?.();
    stop = null;
    container.remove();
  });

  it("warns as soon as the plugin-block dialog has forms selected", () => {
    renderDialog(container, "form");

    stop = startPluginBlockGuard(container);

    const warning = container.querySelector(`.${WARNING_CLASS}`);
    expect(warning).not.toBeNull();
    expect(warning).toHaveTextContent(/Form Display Widget/);
    expect(warning).toHaveAttribute("role", "alert");
  });

  it("stands in the place of the rows it hides, right below the plugin picker", () => {
    const { input, pluginRow, otherRows } = renderDialog(container, "form");

    stop = startPluginBlockGuard(container);

    // Every row except the picker's own is hidden …
    expect(pluginRow.style.display).not.toBe("none");
    expect(input.closest(ROW_SELECTOR)).toBe(pluginRow);
    for (const row of otherRows) expect(row.style.display).toBe("none");
    // … and the warning sits where they were.
    expect(pluginRow.nextElementSibling?.className).toBe(WARNING_CLASS);
  });

  it("stays quiet for every other plugin", () => {
    const { otherRows } = renderDialog(container, "survey");

    stop = startPluginBlockGuard(container);

    expect(container.querySelector(`.${WARNING_CLASS}`)).toBeNull();
    for (const row of otherRows) expect(row.style.display).not.toBe("none");
  });

  it("puts the dialog back exactly as it was when the author switches away", () => {
    const { input, otherRows } = renderDialog(container, "survey");
    // One row carries its own inline display, which must survive the round trip.
    otherRows[1].style.display = "flex";
    stop = startPluginBlockGuard(container);

    input.value = "form";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(container.querySelector(`.${WARNING_CLASS}`)).not.toBeNull();
    for (const row of otherRows) expect(row.style.display).toBe("none");

    input.value = "calendar";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(container.querySelector(`.${WARNING_CLASS}`)).toBeNull();
    expect(otherRows[0].style.display).toBe("");
    expect(otherRows[1].style.display).toBe("flex");
    expect(otherRows[1].hasAttribute(HIDDEN_ROW_MARKER)).toBe(false);
  });

  it("notices a dialog that only appears later", async () => {
    stop = startPluginBlockGuard(container);

    renderDialog(container, "forms");
    await flushObserver();

    expect(container.querySelector(`.${WARNING_CLASS}`)).not.toBeNull();
  });

  it("warns once and hides cleanly even though dev-mode starts the guard twice", () => {
    const { otherRows } = renderDialog(container, "form");

    stop = startPluginBlockGuard(container);
    const stopSecond = startPluginBlockGuard(container);
    try {
      expect(container.querySelectorAll(`.${WARNING_CLASS}`)).toHaveLength(1);
      // The second guard must not record "none" as the row's original state.
      expect(otherRows[0].getAttribute(HIDDEN_ROW_MARKER)).toBe("");
    } finally {
      stopSecond();
    }
  });

  it("takes the warning with it and restores the rows when stopped", () => {
    const { otherRows } = renderDialog(container, "form");
    const dispose = startPluginBlockGuard(container);

    dispose();

    expect(container.querySelector(`.${WARNING_CLASS}`)).toBeNull();
    for (const row of otherRows) expect(row.style.display).not.toBe("none");
  });
});

describe("warningText", () => {
  afterEach(() => document.documentElement.removeAttribute("lang"));

  it("speaks the language of the page, with the given German master text", () => {
    document.documentElement.setAttribute("lang", "de-DE");

    expect(warningText()).toBe(
      'Die Einbindung von Forms über das Plugin Widget ist nicht CI konform! ' +
        'Bitte nutze stattdessen das "Form Display Widget".',
    );
  });

  it("covers further tenant languages", () => {
    document.documentElement.setAttribute("lang", "fr");
    expect(warningText()).toContain("conforme à la CI");

    document.documentElement.setAttribute("lang", "pl-PL");
    expect(warningText()).toContain("niezgodne z CI");
  });

  it("falls back to English for a language it does not know", () => {
    document.documentElement.setAttribute("lang", "ja");

    expect(warningText()).toContain("not CI compliant");
    expect(warningText()).toContain("Form Display Widget");
  });
});
