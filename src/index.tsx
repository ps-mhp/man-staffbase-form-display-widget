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
import { configurationSchema, uiSchema } from "./configuration-schema";
import { readFormId } from "./form-id";
import { fetchEntityCatalog } from "@shared/entity-picker/entity-catalog";
import { startEntityPickerInjector } from "@shared/entity-picker/entity-picker-injector";
import { formCatalogSource } from "./form-catalog";
import { startPluginBlockGuard } from "./plugin-block-guard";
import { FormView } from "./form-view";
import icon from "../resources/form-display-widget.svg";
import pkg from "../package.json";

/**
 * The names the configuration goes by.
 *
 * Each has to be spelled the same in three places: the key in the
 * configuration schema, the attribute declared to the host, and the name read
 * back here. They are also the attributes registered for this widget in
 * `widgets.json`.
 */
export const FORM_ID_ATTRIBUTE = "form-id";
export const ACCENT_COLOR_ATTRIBUTE = "accent-color";
export const DENSITY_ATTRIBUTE = "density";
export const REQUIRED_MARKER_ATTRIBUTE = "required-marker";

/** Attributes handled by the widget; mirrored in the configuration schema. */
const widgetAttributes: string[] = [
  FORM_ID_ATTRIBUTE,
  ACCENT_COLOR_ATTRIBUTE,
  DENSITY_ATTRIBUTE,
  REQUIRED_MARKER_ATTRIBUTE,
];

/** The accents the dialog offers; anything else falls back to MAN red. */
const ACCENT_COLORS = ["#e40045", "#303c49", "#12171c"];

/**
 * Each field carries a default in the schema, but a saved configuration from
 * before the field existed has nothing under the key at all — so the default
 * is applied here as well and not only in the dialog.
 */
export function readAccentColor(raw: unknown): string {
  return typeof raw === "string" && ACCENT_COLORS.includes(raw) ? raw : ACCENT_COLORS[0];
}

export function readCompact(raw: unknown): boolean {
  return raw === "compact";
}

export function readRequiredMarker(raw: unknown): string {
  return raw === "text" ? " (required)" : " *";
}

/** Copy for the dropdown next to the `form-id` field. */
const FORM_PICKER_LABELS = {
  placeholder: "Formular auswählen …",
  manualOption: "Andere ID eingeben …",
  unavailableNotice:
    "Die Liste der Formulare konnte nicht geladen werden. Bitte die Formular-ID eintragen.",
};

/**
 * Watches for the configuration dialog from module load on.
 *
 * The dialog is opened by the host, not by this widget, and may already be on
 * screen by the time the bundle arrives — so there is no render to hook into.
 * Costs nothing on a published page, where the field never appears.
 *
 * Exported only so tests can dispose of the observer on teardown; production
 * code never calls this.
 */
export const stopFormPickerInjector = startEntityPickerInjector({
  fieldKey: FORM_ID_ATTRIBUTE,
  fetchOptions: () => fetchEntityCatalog(formCatalogSource),
  labels: FORM_PICKER_LABELS,
});

/**
 * Also watching from module load on: the warning for authors who embed a form
 * through Staffbase's own plugin-block instead of this widget.
 */
export const stopPluginBlockGuard = startPluginBlockGuard();

const factory: BlockFactory = (BaseBlockClass, _widgetApi) => {
  return class FormDisplayWidgetBlock extends BaseBlockClass implements BaseBlock {
    private _root: ReactDOM.Root | null = null;

    public renderBlock(container: HTMLElement): void {
      const attrs = this.parseAttributes<Record<string, unknown>>();

      // The SDK is assumed to pass the same container for the life of the block.
      this._root ??= ReactDOM.createRoot(container);
      this._root.render(
        <FormView
          formId={readFormId(attrs[FORM_ID_ATTRIBUTE])}
          accent={readAccentColor(attrs[ACCENT_COLOR_ATTRIBUTE])}
          compact={readCompact(attrs[DENSITY_ATTRIBUTE])}
          requiredMarker={readRequiredMarker(attrs[REQUIRED_MARKER_ATTRIBUTE])}
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
if (typeof window.defineBlock === "function") {
  void startWidget({
    name: "form-display-widget",
    version: pkg.version,
    register: () => window.defineBlock(externalBlockDefinition),
  });
}
