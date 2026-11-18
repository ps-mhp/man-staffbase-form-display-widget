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

import { startWidget } from "@shared/dev-mode/start-widget";
import { setPublicPathFromBundle } from "@shared/public-path";

// Must run before any dynamic `import()`, so that lazily loaded chunks come
// from the CDN the bundle was served from and not from the hosting page.
setPublicPathFromBundle("form-display-widget.js");
import React from "react";
import ReactDOM from "react-dom/client";

import { BlockFactory, BlockDefinition, ExternalBlockDefinition, BaseBlock } from "widget-sdk";
import { ALL_ATTRIBUTES, configurationSchema, uiSchema } from "./configuration-schema";
import { startFormDisplayDialog } from "./form-dialog";
import { resolveFormDisplay } from "./form-display-config";
import { startPluginBlockGuard } from "./plugin-block-guard";
import { FormView } from "./form-view";
import icon from "../resources/form-display-widget.svg";
import pkg from "../package.json";

export {
  ACCENT_COLOR_ATTRIBUTE,
  DENSITY_ATTRIBUTE,
  FORM_DISPLAY_CONFIG_ATTRIBUTE,
  FORM_ID_ATTRIBUTE,
  REQUIRED_MARKER_ATTRIBUTE,
} from "./configuration-schema";
export { readAccentColor, readCompact, readRequiredMarker } from "./form-display-config";

/**
 * Die Attribute des Widgets, aus dem Schema genommen, damit beide nicht
 * auseinanderlaufen: ein Tippfehler hier zeigte sich sonst erst zur
 * Laufzeit, als Attribut, das still leer bleibt.
 */
const widgetAttributes: string[] = ALL_ATTRIBUTES;

/**
 * Watching from module load on: the warning for authors who embed a form
 * through Staffbase's own plugin-block instead of this widget. The host opens
 * that dialog, not this widget, and it may already be on screen by the time
 * the bundle arrives — so there is no render to hook into. Costs nothing on a
 * published page, where the dialog never appears.
 *
 * Exported only so tests can dispose of the observer on teardown; production
 * code never calls this.
 */
export const stopPluginBlockGuard = startPluginBlockGuard();

const factory: BlockFactory = (BaseBlockClass, _widgetApi) => {
  return class FormDisplayWidgetBlock extends BaseBlockClass implements BaseBlock {
    private _root: ReactDOM.Root | null = null;

    public renderBlock(container: HTMLElement): void {
      // Je Schlüssel `form-display-config`, sonst das alte Attribut, sonst
      // die Vorgabe (`form-display-config.ts`). Ein alter Block ohne neues
      // Attribut zeigt sich damit genau wie bisher.
      const display = resolveFormDisplay(this.parseAttributes<Record<string, unknown>>());

      // The SDK is assumed to pass the same container for the life of the block.
      this._root ??= ReactDOM.createRoot(container);
      this._root.render(
        <FormView
          formId={display.formId}
          accent={display.accent}
          compact={display.compact}
          requiredMarker={display.requiredMarker}
        />,
      );
    }

    public unmountBlock(_container: HTMLElement): void {
      this._root?.unmount();
      this._root = null;
    }

    public static get observedAttributes(): string[] {
      return widgetAttributes;
    }

    public attributeChangedCallback(...args: [string, string | undefined, string | undefined]): void {
      super.attributeChangedCallback.apply(this, args);
    }
  };
};

const blockDefinition: BlockDefinition = {
  name: "form-display-widget",
  factory: factory,
  attributes: widgetAttributes,
  blockLevel: "block",
  configurationSchema: configurationSchema,
  uiSchema: uiSchema,
  label: "FormDisplay",
  iconUrl: icon,
};

const externalBlockDefinition: ExternalBlockDefinition = {
  blockDefinition,
  author: pkg.author,
  version: pkg.version,
};

// The guard lets the module load in Jest/jsdom where defineBlock is absent,
// while keeping the call unconditional in the real Staffbase host, where it is
// always present — in the editor and on a published page alike.
// Registration runs through `startWidget`, which first asks whether a local
// development server serves this widget. On virtually every browser the answer
// is no and this registers immediately; on the developer's machine the local
// bundle takes over and registers instead. Only ever one of the two, a block
// name cannot be claimed twice.
//
// Das Fenster „Formular wählen“ hängt am Anmelden, nicht am Laden: auf
// Modulebene gestartet, belegte das installierte Bündel das Feld
// `form-display-config`, bevor feststeht, ob ein lokaler Entwicklungsserver
// übernimmt – dann käme die Ansicht von dort, das Fenster aber aus der
// veröffentlichten Fassung (im Hero-Slider-Widget so beobachtet). Bis
// 0.1.0-rc.3 stand hier stattdessen eine Auswahlliste am Feld `form-id`; die
// Liste steht jetzt links im Fenster.
if (typeof window.defineBlock === "function") {
  void startWidget({
    name: "form-display-widget",
    version: pkg.version,
    register: () => {
      startFormDisplayDialog();
      window.defineBlock(externalBlockDefinition);
    },
  });
}
