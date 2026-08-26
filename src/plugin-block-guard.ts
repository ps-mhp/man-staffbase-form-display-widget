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
 * Warns authors away from embedding a form through Staffbase's own
 * plugin-block ("Plugin" widget).
 *
 * That block's configuration dialog offers a "Forms" entry and renders the
 * form in an iframe with a fixed height — everything this widget exists to
 * avoid. While "Forms" is selected, every settings row except the plugin
 * picker itself is hidden and the warning stands in their place; switching
 * to another plugin puts the dialog back exactly as it was.
 *
 * The dialog is the host's, not ours, so the same DOM bet as in
 * `config-field-injector` applies: the selection is mirrored in a hidden
 * `input[name="pluginType"]`, the settings sit in `.ui-commons__config-input__row`
 * rows, and picking "Forms" re-renders the dialog — which is what wakes the
 * observer.
 */

/** The hidden field the plugin-block dialog mirrors its selection into. */
export const PLUGIN_TYPE_SELECTOR = 'input[name="pluginType"]';

/** One settings row of the host's configuration dialog. */
export const ROW_SELECTOR = ".ui-commons__config-input__row";

/** Marks the injected notice — and lets a second bundle copy find it. */
export const WARNING_CLASS = "form-display-plugin-block-warning";

/**
 * Marks a row this guard hid, carrying the row's previous inline display so
 * restoring puts back exactly what was there — and so neither a second scan
 * nor the second bundle copy dev-mode loads hides the same row twice.
 */
export const HIDDEN_ROW_MARKER = "data-form-display-hidden-row";

/**
 * The warning per language; the German wording is the given master text.
 * Editors read the dialog in their interface language, so the text follows
 * the page language rather than being fixed to one.
 */
const WARNING_TEXTS: Record<string, string> = {
  de:
    'Die Einbindung von Forms über das Plugin Widget ist nicht CI konform! ' +
    'Bitte nutze stattdessen das "Form Display Widget".',
  en:
    'Embedding Forms via the Plugin widget is not CI compliant! ' +
    'Please use the "Form Display Widget" instead.',
  fr:
    "L'intégration de Forms via le widget Plugin n'est pas conforme à la CI ! " +
    'Veuillez utiliser le "Form Display Widget" à la place.',
  es:
    '¡La integración de Forms mediante el widget Plugin no es conforme a la CI! ' +
    'Utiliza en su lugar el "Form Display Widget".',
  it:
    "L'integrazione di Forms tramite il widget Plugin non è conforme alla CI! " +
    'Utilizza invece il "Form Display Widget".',
  pl:
    'Osadzanie Forms przez widżet Plugin jest niezgodne z CI! ' +
    'Zamiast tego użyj "Form Display Widget".',
  pt:
    'A integração de Forms através do widget Plugin não está em conformidade com a CI! ' +
    'Utilize antes o "Form Display Widget".',
  nl:
    'Het insluiten van Forms via de Plugin-widget is niet CI-conform! ' +
    'Gebruik in plaats daarvan de "Form Display Widget".',
  cs:
    'Vkládání Forms přes widget Plugin není v souladu s CI! ' +
    'Použijte místo toho "Form Display Widget".',
  tr:
    "Forms'un Plugin widget üzerinden eklenmesi CI ile uyumlu değildir! " +
    'Lütfen bunun yerine "Form Display Widget" kullanın.',
};

/**
 * The warning in the language the editor is being read in.
 *
 * The document language is what the Staffbase interface itself follows;
 * `navigator.language` steps in where the page states none. Anything not in
 * the dictionary falls back to English, never to a blank notice.
 */
export function warningText(): string {
  const locale = document.documentElement.getAttribute("lang") || navigator.language || "";
  const base = locale.trim().replace("-", "_").split("_")[0].toLowerCase();
  return WARNING_TEXTS[base] ?? WARNING_TEXTS.en;
}

/** The values the dialog uses for the forms plugin. */
function isFormsPlugin(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized === "form" || normalized === "forms";
}

function buildWarning(): HTMLElement {
  const warning = document.createElement("p");
  warning.className = WARNING_CLASS;
  warning.setAttribute("role", "alert");
  // Inline on purpose: the notice lives in the host's dialog, where none of
  // this widget's stylesheets are guaranteed to be present.
  warning.style.cssText =
    "box-sizing: border-box; width: 100%; margin: 16px 0; " +
    "padding: 10px 12px; border-left: 3px solid #c10039; " +
    "background: #fde7ee; color: #c10039; " +
    "font: 400 13px/1.5 Roboto, Arial, sans-serif;";
  warning.textContent = warningText();
  return warning;
}

/** Hides every settings row except the plugin picker's own. */
function hideOtherRows(input: HTMLInputElement, host: Element): void {
  for (const row of host.querySelectorAll<HTMLElement>(ROW_SELECTOR)) {
    if (row.contains(input)) continue;
    if (row.hasAttribute(HIDDEN_ROW_MARKER)) continue;
    row.setAttribute(HIDDEN_ROW_MARKER, row.style.display);
    row.style.display = "none";
  }
}

/** Puts every row this guard hid back exactly as it was. */
function restoreRows(scope: ParentNode): void {
  for (const row of scope.querySelectorAll<HTMLElement>(`[${HIDDEN_ROW_MARKER}]`)) {
    row.style.display = row.getAttribute(HIDDEN_ROW_MARKER) ?? "";
    row.removeAttribute(HIDDEN_ROW_MARKER);
  }
}

/**
 * Watches for the plugin-block dialog and keeps warning and hidden rows in
 * step with the selected plugin.
 *
 * Safe to start at module load and safe on pages without an editor: until a
 * `pluginType` field exists, a scan finds nothing. Idempotent across the two
 * bundle copies dev-mode loads — the DOM markers are the shared ground truth.
 *
 * @returns a function that stops watching, removes the warning and restores
 *          every row it hid.
 */
export function startPluginBlockGuard(root: ParentNode = document): () => void {
  const scan = (): void => {
    for (const input of root.querySelectorAll<HTMLInputElement>(PLUGIN_TYPE_SELECTOR)) {
      const host = input.closest("form") ?? input.parentElement;
      if (host === null) continue;

      const existing = host.querySelector(`.${WARNING_CLASS}`);
      if (!isFormsPlugin(input.value)) {
        existing?.remove();
        restoreRows(host);
        continue;
      }

      // The warning takes the place of the rows it hides: right below the
      // plugin picker's row, where the form settings would otherwise start.
      hideOtherRows(input, host);
      if (existing === null) {
        const pluginRow = input.closest(ROW_SELECTOR);
        if (pluginRow !== null) pluginRow.insertAdjacentElement("afterend", buildWarning());
        else host.insertAdjacentElement("beforeend", buildWarning());
      }
    }
  };

  scan();

  const observer = new MutationObserver(scan);
  const target: Node = root === document ? document.body : (root as Element);
  observer.observe(target, { childList: true, subtree: true, attributes: true });

  // The dialog writes the hidden field from its own dropdown; if that write
  // fires an event but no re-render, the observer alone would miss it.
  const eventTarget = root as unknown as EventTarget;
  eventTarget.addEventListener("change", scan, true);
  eventTarget.addEventListener("input", scan, true);

  return () => {
    observer.disconnect();
    eventTarget.removeEventListener("change", scan, true);
    eventTarget.removeEventListener("input", scan, true);
    for (const warning of root.querySelectorAll(`.${WARNING_CLASS}`)) warning.remove();
    restoreRows(root);
  };
}
