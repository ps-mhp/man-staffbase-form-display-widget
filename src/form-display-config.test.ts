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

import { encodePayload } from "@shared/payload";

import {
  configFromLegacy,
  displayOf,
  mergeFormDisplayConfig,
  readAccentColor,
  readCompact,
  readFormDisplayConfig,
  readRequiredMarker,
  resolveFormDisplay,
  serializeFormDisplayConfig,
} from "./form-display-config";

const A = "aaaaaaaaaaaaaaaaaaaaaaaa";
const B = "bbbbbbbbbbbbbbbbbbbbbbbb";

describe("die einzelnen Werte lesen", () => {
  it("nimmt jede angebotene Akzentfarbe und sonst MAN Rot", () => {
    expect(readAccentColor("#303c49")).toBe("#303c49");
    expect(readAccentColor("#12171c")).toBe("#12171c");
    expect(readAccentColor("#00a4fd")).toBe("#e40045");
    expect(readAccentColor(undefined)).toBe("#e40045");
  });

  it("nimmt nur das ausdrückliche „compact“ als kompakt", () => {
    expect(readCompact("compact")).toBe(true);
    expect(readCompact("standard")).toBe(false);
    expect(readCompact(undefined)).toBe(false);
  });

  it("schreibt die Pflichtmarke wie eingestellt", () => {
    expect(readRequiredMarker("text")).toBe(" (required)");
    expect(readRequiredMarker("asterisk")).toBe(" *");
    expect(readRequiredMarker(undefined)).toBe(" *");
  });
});

describe("form-display-config lesen und schreiben", () => {
  it("liest zurück, was geschrieben wurde", () => {
    const config = { formId: A, accent: "#303c49", density: "compact", requiredMarker: "text" } as const;

    expect(readFormDisplayConfig(serializeFormDisplayConfig(config))).toEqual(config);
  });

  it("schreibt nur gesetzte Schlüssel – ein fehlender lässt das alte Attribut gelten", () => {
    const raw = serializeFormDisplayConfig({ density: "compact" });

    expect(readFormDisplayConfig(raw)).toEqual({ density: "compact" });
    expect(raw.startsWith("b64:")).toBe(true);
  });

  it("liest auch unkodiertes JSON", () => {
    expect(readFormDisplayConfig(JSON.stringify({ formId: A }))).toEqual({ formId: A });
  });

  it("gibt bei leerem, kaputtem oder fremdem Inhalt null zurück", () => {
    expect(readFormDisplayConfig("")).toBeNull();
    expect(readFormDisplayConfig("   ")).toBeNull();
    expect(readFormDisplayConfig("{kaputt")).toBeNull();
    expect(readFormDisplayConfig("[1,2]")).toBeNull();
    expect(readFormDisplayConfig(undefined)).toBeNull();
  });

  it("lässt unbrauchbare Werte weg, statt sie zur Vorgabe zu machen", () => {
    const raw = encodePayload(
      JSON.stringify({ formId: "keine id", accent: "#00a4fd", density: "eng", requiredMarker: "text" }),
    );

    expect(readFormDisplayConfig(raw)).toEqual({ requiredMarker: "text" });
  });

  it("nimmt eine Formular-Adresse als ID", () => {
    expect(readFormDisplayConfig(JSON.stringify({ formId: `https://x.test/plugins/forms/${A.toUpperCase()}` }))).toEqual({
      formId: A,
    });
  });
});

describe("configFromLegacy", () => {
  it("übernimmt nur lesbare, gültige Werte der alten Felder", () => {
    expect(
      configFromLegacy({ "form-id": A, "accent-color": "#303c49", density: "compact", "required-marker": "text" }),
    ).toEqual({ formId: A, accent: "#303c49", density: "compact", requiredMarker: "text" });
    expect(configFromLegacy({ "form-id": "", "accent-color": "", density: undefined })).toEqual({});
  });
});

describe("mergeFormDisplayConfig", () => {
  it("nimmt je Schlüssel den ersten gesetzten Wert", () => {
    expect(mergeFormDisplayConfig({ formId: A }, { formId: B, density: "compact" })).toEqual({
      formId: A,
      density: "compact",
    });
  });
});

describe("resolveFormDisplay – was die Seite zeigt", () => {
  const legacy = { "form-id": A, "accent-color": "#303c49", density: "compact", "required-marker": "text" };

  it("zeigt einen alten Block ohne neues Attribut genau wie bisher", () => {
    expect(resolveFormDisplay(legacy)).toEqual({
      formId: A,
      accent: "#303c49",
      compact: true,
      requiredMarker: " (required)",
    });
    expect(resolveFormDisplay({ ...legacy, "form-display-config": "" })).toEqual(resolveFormDisplay(legacy));
    expect(resolveFormDisplay({})).toEqual({ formId: null, accent: "#e40045", compact: false, requiredMarker: " *" });
  });

  it("mischt je Schlüssel: neuer Wert, sonst altes Attribut, sonst Vorgabe", () => {
    const raw = serializeFormDisplayConfig({ formId: B, density: "standard" });

    expect(resolveFormDisplay({ ...legacy, "form-display-config": raw })).toEqual({
      formId: B,
      accent: "#303c49",
      compact: false,
      requiredMarker: " (required)",
    });
    expect(resolveFormDisplay({ "form-display-config": raw })).toEqual({
      formId: B,
      accent: "#e40045",
      compact: false,
      requiredMarker: " *",
    });
  });

  it("fällt bei kaputtem neuem Attribut ganz auf die alten zurück", () => {
    expect(resolveFormDisplay({ ...legacy, "form-display-config": "b64:%%%" })).toEqual(resolveFormDisplay(legacy));
  });
});

describe("displayOf – was die Vorschau zeigt", () => {
  it("setzt für ungesetzte Schlüssel die Vorgabe", () => {
    expect(displayOf({ accent: "#12171c" })).toEqual({
      formId: null,
      accent: "#12171c",
      compact: false,
      requiredMarker: " *",
    });
  });
});
