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

import { readLegacyFromDialog, startHiddenFields } from "./legacy-fields";

const OWN = "form-display-config";
const LEGACY = ["form-id", "accent-color", "density", "required-marker"];

function row(key: string, value = ""): string {
  return `<div data-row="${key}"><label for="root_${key}">${key}</label><input id="root_${key}" value="${value}"><p>Hilfe</p></div>`;
}

const rowOf = (selector: string): HTMLElement | null => document.querySelector<HTMLElement>(selector);

afterEach(() => {
  document.body.innerHTML = "";
});

describe("startHiddenFields", () => {
  it("blendet die alten Felder im eigenen Dialog ganz aus und lässt das eigene stehen", () => {
    document.body.innerHTML = `<form>${row(OWN)}${LEGACY.map((key) => row(key)).join("")}</form>`;

    const stop = startHiddenFields(LEGACY, OWN);

    for (const key of LEGACY) expect(rowOf(`[data-row="${key}"]`)?.style.display).toBe("none");
    expect(rowOf(`[data-row="${OWN}"]`)?.style.display).toBe("");
    stop();
    for (const key of LEGACY) expect(rowOf(`[data-row="${key}"]`)?.style.display).toBe("");
  });

  it("erfasst Felder, die erst später erscheinen", async () => {
    document.body.innerHTML = "<form></form>";
    const stop = startHiddenFields(LEGACY, OWN);

    document.querySelector("form")?.insertAdjacentHTML("beforeend", `${row(OWN)}${row("density")}`);
    await Promise.resolve();

    expect(rowOf('[data-row="density"]')?.style.display).toBe("none");
    stop();
  });

  // Studio lädt alle Widget-Bündel in dasselbe Dokument, `root_<key>` ist
  // widgetübergreifend: ein fremder Dialog mit gleichem Feldnamen bleibt stehen.
  it("lässt den Dialog eines anderen Widgets mit gleichen Feldnamen unberührt", () => {
    document.body.innerHTML =
      `<form id="foreign"><div data-wrap>${row("config")}${row("density")}</div></form>` +
      `<form id="own">${row(OWN)}${row("density")}</form>`;

    const stop = startHiddenFields(LEGACY, OWN);

    expect(rowOf('#foreign [data-row="density"]')?.style.display).toBe("");
    expect(rowOf("#foreign [data-wrap]")?.style.display).toBe("");
    expect(rowOf('#own [data-row="density"]')?.style.display).toBe("none");
    stop();
  });
});

describe("readLegacyFromDialog", () => {
  it("liest die alten Felder aus dem eigenen Dialog, nicht aus einem fremden", () => {
    document.body.innerHTML =
      `<form id="foreign">${row("config")}${row("density", "compact")}</form>` +
      `<form id="own">${row(OWN)}${row("form-id", "abc")}${row("accent-color", "#303c49")}</form>`;

    expect(readLegacyFromDialog()).toEqual({ "form-id": "abc", "accent-color": "#303c49" });
  });

  it("liefert nichts ohne eigenen Dialog", () => {
    document.body.innerHTML = `<form>${row("density", "compact")}</form>`;

    expect(readLegacyFromDialog()).toEqual({});
  });

  // Im Content Designer sind Auswahlfelder keine echten `<select>`: was dort
  // `root_<key>` trägt, hat keinen lesbaren Wert. Dann bleibt der Schlüssel offen.
  it("überspringt Felder ohne lesbaren Wert", () => {
    document.body.innerHTML = `<form>${row(OWN)}<div id="root_density" role="combobox">Kompakt</div></form>`;

    expect(readLegacyFromDialog()).toEqual({});
  });

  // RJSF schreibt die Stelle der Option, nicht ihren Wert.
  it("übersetzt die Stelle einer Option in ihren Wert", () => {
    document.body.innerHTML =
      `<form>${row(OWN)}<select id="root_required-marker"><option value="0">Sternchen</option>` +
      `<option value="1" selected>(required)</option></select></form>`;

    expect(readLegacyFromDialog()).toEqual({ "required-marker": "text" });
  });

  it("liest eine MUI-Auswahl über ihr verstecktes Eingabefeld", () => {
    document.body.innerHTML =
      `<form>${row(OWN)}<div class="row"><div id="root_accent-color" role="combobox">Schwarz</div>` +
      `<input aria-hidden="true" tabindex="-1" name="root_accent-color" value="2"></div></form>`;

    expect(readLegacyFromDialog()).toEqual({ "accent-color": "#12171c" });
  });
});
