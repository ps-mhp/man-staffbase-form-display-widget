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
  ACCENT_COLOR_ATTRIBUTE,
  DENSITY_ATTRIBUTE,
  FORM_DISPLAY_CONFIG_ATTRIBUTE,
  FORM_ID_ATTRIBUTE,
  REQUIRED_MARKER_ATTRIBUTE,
  readAccentColor,
  readCompact,
  readRequiredMarker,
  stopPluginBlockGuard,
} from "./index";
import { configurationSchema, uiSchema } from "./configuration-schema";

describe("the widget's attributes", () => {
  it("are exactly the keys the configuration schema stores under", () => {
    // The host saves a value under its schema key verbatim and reads it back
    // under the declared attribute. Any difference puts the value where
    // nothing looks.
    // Das neue Attribut zuerst, die alten dahinter – so stehen sie auch in
    // `widgets.json`.
    expect(Object.keys(configurationSchema.properties!)).toEqual([
      FORM_DISPLAY_CONFIG_ATTRIBUTE,
      FORM_ID_ATTRIBUTE,
      ACCENT_COLOR_ATTRIBUTE,
      DENSITY_ATTRIBUTE,
      REQUIRED_MARKER_ATTRIBUTE,
    ]);
  });

  // Editoren hängen sich über `root_<Attribut>` ein, ohne das Widget zu
  // kennen; `config` hat schon das Hotspot-Widget.
  it("names the one configuration attribute after the widget", () => {
    expect(FORM_DISPLAY_CONFIG_ATTRIBUTE).toBe("form-display-config");
  });

  it("explains only the configuration field in the dialog; the old fields are hidden", () => {
    expect(Object.keys(uiSchema)).toEqual([FORM_DISPLAY_CONFIG_ATTRIBUTE]);
  });
});

describe("reading the appearance configuration", () => {
  it("takes each offered accent and falls back to MAN red for anything else", () => {
    expect(readAccentColor("#303c49")).toBe("#303c49");
    expect(readAccentColor("#12171c")).toBe("#12171c");
    expect(readAccentColor("#00a4fd")).toBe("#e40045");
    expect(readAccentColor(undefined)).toBe("#e40045");
  });

  it("treats only the explicit compact density as compact", () => {
    expect(readCompact("compact")).toBe(true);
    expect(readCompact("standard")).toBe(false);
    expect(readCompact(undefined)).toBe(false);
  });

  it("spells the required marker as configured", () => {
    expect(readRequiredMarker("text")).toBe(" (required)");
    expect(readRequiredMarker("asterisk")).toBe(" *");
    expect(readRequiredMarker(undefined)).toBe(" *");
  });
});

describe("the plugin-block guard", () => {
  it("is started at module load and can be stopped again", () => {
    // The host's plugin-block dialog may already be open when this bundle
    // arrives, so the guard has to be watching from the start.
    expect(typeof stopPluginBlockGuard).toBe("function");
    stopPluginBlockGuard();
  });
});
