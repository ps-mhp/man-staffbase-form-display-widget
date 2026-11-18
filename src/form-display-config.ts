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
 * Die Konfiguration der Formular-Anzeige in einem Attribut:
 * `form-display-config`.
 *
 * Bis 0.1.0-rc.3 lag sie auf vier Feldern des Staffbase-Dialogs. Drei davon
 * sind Auswahlfelder, und die sind im Content Designer keine echten
 * `<select>`: ihr Wert ist von außen nicht zu lesen. Seither pflegt das
 * Fenster „Formular wählen“ alles und schreibt es hierher.
 *
 * Jeder Schlüssel ist einzeln optional. Fehlt er, gilt für ihn weiter das
 * alte Attribut, sonst die Vorgabe ({@link resolveFormDisplay}). So bleibt ein
 * alter Block, der nur die einzelnen Felder trägt, genau wie er war – und ein
 * Wert, den das Fenster beim Öffnen nicht lesen konnte, wird beim Übernehmen
 * nicht mit der Vorgabe überschrieben, solange niemand ihn ändert.
 *
 * Der Name trägt das Widget: Editoren hängen sich über `root_<Attribut>` ein,
 * ohne das Widget zu kennen, und `config` hat schon das Hotspot-Widget.
 */

import { decodePayload, encodePayload } from "@shared/payload";

import { readFormId } from "./form-id";

/** Die angebotenen Akzente: MAN Rot, Anthrazit, Schwarz. */
export const ACCENT_COLORS = ["#e40045", "#303c49", "#12171c"] as const;
export type AccentColor = (typeof ACCENT_COLORS)[number];

export const DENSITIES = ["standard", "compact"] as const;
export type Density = (typeof DENSITIES)[number];

export const REQUIRED_MARKERS = ["asterisk", "text"] as const;
export type RequiredMarker = (typeof REQUIRED_MARKERS)[number];

export interface FormDisplayConfig {
  /** Die 24-stellige ID der Formular-Installation, klein geschrieben. */
  formId?: string;
  accent?: AccentColor;
  density?: Density;
  requiredMarker?: RequiredMarker;
}

/** Die vier Attribute bis 0.1.0-rc.3, so wie sie am Element ankommen. */
export interface LegacyFormAttributes {
  "form-id"?: unknown;
  "accent-color"?: unknown;
  density?: unknown;
  "required-marker"?: unknown;
}

/** Alle Attribute des Blocks, wie `parseAttributes` sie liefert. */
export interface FormDisplayAttributes extends LegacyFormAttributes {
  "form-display-config"?: unknown;
}

/** Was die Ansicht braucht; aufgelöst, ohne offene Schlüssel. */
export interface FormDisplay {
  formId: string | null;
  accent: string;
  compact: boolean;
  requiredMarker: string;
}

function oneOf<T extends string>(values: readonly T[], raw: unknown): T | undefined {
  return values.find((value) => value === raw);
}

/**
 * Jedes Feld hat eine Vorgabe im Schema, aber ein Block von vor dem Feld
 * trägt unter dem Schlüssel gar nichts – darum gilt die Vorgabe auch hier.
 */
export function readAccentColor(raw: unknown): string {
  return oneOf(ACCENT_COLORS, raw) ?? ACCENT_COLORS[0];
}

export function readCompact(raw: unknown): boolean {
  return raw === "compact";
}

export function readRequiredMarker(raw: unknown): string {
  return raw === "text" ? " (required)" : " *";
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

/** Nur die Schlüssel, die etwas tragen – ein `undefined` hieße im JSON nichts anderes. */
function compact(config: FormDisplayConfig): FormDisplayConfig {
  return Object.fromEntries(Object.entries(config).filter(([, value]) => value !== undefined)) as FormDisplayConfig;
}

/** Baut die Konfiguration aus losen Werten; was nicht passt, bleibt offen. */
function configOf(formId: unknown, accent: unknown, density: unknown, requiredMarker: unknown): FormDisplayConfig {
  return compact({
    formId: readFormId(formId) ?? undefined,
    accent: oneOf(ACCENT_COLORS, accent),
    density: oneOf(DENSITIES, density),
    requiredMarker: oneOf(REQUIRED_MARKERS, requiredMarker),
  });
}

/**
 * Liest `form-display-config`; `null`, wenn dort nichts Brauchbares steht –
 * leer, kaputt kodiert oder kein Objekt. Dann gelten die alten Felder.
 */
export function readFormDisplayConfig(raw: unknown): FormDisplayConfig | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const value = parseJson(decodePayload(trimmed) ?? trimmed);
  if (!isRecord(value)) return null;
  return configOf(value.formId, value.accent, value.density, value.requiredMarker);
}

/** Schreibt `form-display-config`, kodiert wie die übrigen JSON-Attribute (`@shared/payload`). */
export function serializeFormDisplayConfig(config: FormDisplayConfig): string {
  const { formId, accent, density, requiredMarker } = config;
  return encodePayload(JSON.stringify(compact({ formId, accent, density, requiredMarker })));
}

/** Die Konfiguration aus den einzelnen Feldern älterer Fassungen; Unlesbares bleibt offen. */
export function configFromLegacy(attrs: LegacyFormAttributes): FormDisplayConfig {
  return configOf(attrs["form-id"], attrs["accent-color"], attrs.density, attrs["required-marker"]);
}

/** Je Schlüssel der erste gesetzte Wert: `primary`, sonst `fallback`. */
export function mergeFormDisplayConfig(primary: FormDisplayConfig, fallback: FormDisplayConfig): FormDisplayConfig {
  return compact({
    formId: primary.formId ?? fallback.formId,
    accent: primary.accent ?? fallback.accent,
    density: primary.density ?? fallback.density,
    requiredMarker: primary.requiredMarker ?? fallback.requiredMarker,
  });
}

/** Was eine Konfiguration zeigt; offene Schlüssel bekommen die Vorgabe. */
export function displayOf(config: FormDisplayConfig): FormDisplay {
  return {
    formId: config.formId ?? null,
    accent: readAccentColor(config.accent),
    compact: readCompact(config.density),
    requiredMarker: readRequiredMarker(config.requiredMarker),
  };
}

/**
 * Was die Seite zeigt: je Schlüssel `form-display-config`, sonst das alte
 * Attribut, sonst die Vorgabe. Ohne neues Attribut ist das genau das Lesen
 * von 0.1.0-rc.3.
 */
export function resolveFormDisplay(attrs: FormDisplayAttributes): FormDisplay {
  const config = readFormDisplayConfig(attrs["form-display-config"]) ?? {};
  return {
    formId: config.formId ?? readFormId(attrs["form-id"]),
    accent: readAccentColor(config.accent ?? attrs["accent-color"]),
    compact: readCompact(config.density ?? attrs.density),
    requiredMarker: readRequiredMarker(config.requiredMarker ?? attrs["required-marker"]),
  };
}
