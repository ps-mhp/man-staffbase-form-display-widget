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
 * Die Teile des Formulars im Fenster „Formular wählen“: Kopf mit dem
 * gewählten Formular, der Abschnitt Gestaltung und – zugeklappt – die
 * Eingabe einer ID von Hand.
 *
 * Aufgebaut wie im Screen: das Formular wird links gewählt, hier steht es
 * nur zum Ablesen als Überschrift. Akzentfarbe, Dichte und Pflichtmarke sind
 * Pills mit Label darüber; die Akzente tragen ein Farbmuster.
 *
 * Dieselbe Gestaltung steht in den Geräteansichten im Inspektor, dort ohne
 * den Hinweis zur Pflichtmarke (`detailed={false}`): die Vorschau daneben
 * zeigt, was gilt.
 *
 * Ein Schlüssel ohne Wert ist einer, den das Fenster aus dem alten Feld nicht
 * lesen konnte (Auswahlfelder im Content Designer). Dann ist keine Pill
 * gewählt, und der Hinweis sagt, dass bis zur Wahl die bisherige Einstellung
 * des Blocks gilt – das Fenster überschreibt sie nicht von sich aus.
 */

import * as React from "react";
import { TriangleAlert } from "lucide-react";
import { Field } from "@man/config-ui/form/field";
import { FormSection } from "@man/config-ui/form/form-section";
import type { IconComponent, SegmentedOption } from "@man/config-ui/form/segmented";
import { SegmentedField } from "@man/config-ui/form/segmented-field";
import { Input } from "@man/config-ui/primitives/input";
import { cn } from "@man/config-ui/primitives/utils";

import { ACCENT_COLORS, AccentColor, Density, FormDisplayConfig, RequiredMarker } from "./form-display-config";
import { readFormId } from "./form-id";

export interface SectionProps {
  value: FormDisplayConfig;
  onChange: (value: FormDisplayConfig) => void;
}

const HINT = "text-[13px] text-muted-foreground";

const ACCENT_LABELS: Readonly<Record<AccentColor, string>> = {
  "#e40045": "MAN Rot",
  "#303c49": "Anthrazit",
  "#12171c": "Schwarz",
};

/**
 * Ein Farbmuster als „Icon“ einer Pill: 14 px rund, mit zarter Kante, damit
 * auch Schwarz auf dunklem Grund erkennbar bleibt. Die Farbe ist der Wert
 * selbst, kein Token.
 */
function swatchOf(color: AccentColor): IconComponent {
  function Swatch({ className }: { className?: string }): React.ReactElement {
    return (
      <span
        aria-hidden
        data-swatch={color}
        className={cn(className, "size-3.5 shrink-0 rounded-full ring-1 ring-foreground/30 ring-inset")}
        style={{ backgroundColor: color }}
      />
    );
  }
  Swatch.displayName = `Swatch(${ACCENT_LABELS[color]})`;
  return Swatch;
}

const ACCENT_OPTIONS: readonly SegmentedOption<AccentColor>[] = ACCENT_COLORS.map((id) => ({
  id,
  label: ACCENT_LABELS[id],
  icon: swatchOf(id),
}));

const DENSITY_OPTIONS: readonly SegmentedOption<Density>[] = [
  { id: "standard", label: "Standard · 40 px" },
  { id: "compact", label: "Kompakt · 36 px" },
];

const MARKER_OPTIONS: readonly SegmentedOption<RequiredMarker>[] = [
  { id: "asterisk", label: "*" },
  { id: "text", label: "(required)" },
];

const MARKER_HINT = "Steht hinter jedem Pflichtfeld des Formulars.";

/** Für einen Schlüssel, den das Fenster aus dem alten Feld nicht lesen konnte. */
export const KEEP_HINT = "Noch nicht gewählt – bis dahin gilt die bisherige Einstellung des Blocks.";

/** Eine Meldung wie die von `Field`: Symbol und Text, vorgelesen, sobald sie erscheint. */
export function IssueText({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <p role="alert" className="flex items-start gap-1.5 text-[13px] text-destructive">
      <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

interface ChoiceFieldProps<T extends string> {
  label: string;
  options: readonly SegmentedOption<T>[];
  /** Ohne Wert ist keine Pill gewählt; siehe oben. */
  value: T | undefined;
  onChange: (value: T) => void;
  hint?: string;
}

/** Pills mit Label und Hinweis; ohne Wert keine gewählt, dazu der Hinweis, was dann gilt. */
function ChoiceField<T extends string>({ label, options, value, onChange, hint }: ChoiceFieldProps<T>): React.ReactElement {
  const hints = [hint, value === undefined ? KEEP_HINT : undefined].filter((part) => part !== undefined).join(" ");
  return (
    <SegmentedField<T | "">
      label={label}
      hint={hints === "" ? undefined : hints}
      options={options}
      value={value ?? ""}
      onChange={(next) => {
        if (next !== "") onChange(next as T);
      }}
    />
  );
}

export interface FormHeadingProps {
  formId: string | undefined;
  /** Titel des gewählten Formulars, sonst seine ID. */
  title: string;
  /** Die Zeile daneben, etwa „Formular · links gewählt“. */
  kicker: string;
  /** Die Meldung, wenn „Übernehmen“ am fehlenden Formular scheiterte. */
  issue?: string;
}

/** Der Kopf des Formulars: welches Formular gilt. Ohne Wahl sagt er, wo man wählt. */
export function FormHeading({ formId, title, kicker, issue }: FormHeadingProps): React.ReactElement {
  const chosen = formId !== undefined;
  return (
    <div className="flex flex-col gap-1.5" data-testid="form-heading">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h2 className="text-xl leading-[1.3] font-semibold break-words text-foreground">
          {chosen ? title : "Noch kein Formular gewählt"}
        </h2>
        <span className={HINT}>{chosen ? kicker : "Formular links in der Liste wählen"}</span>
      </div>
      {issue !== undefined && <IssueText>{issue}</IssueText>}
    </div>
  );
}

export interface DesignSectionProps extends SectionProps {
  /** Im Formular mit Hinweis zur Pflichtmarke; im Inspektor nur die Wahl. */
  detailed: boolean;
  /** Im Inspektor gibt es keinen Kopf: dort steht die Meldung zum fehlenden Formular. */
  issue?: string;
}

export function DesignSection({ value, onChange, detailed, issue }: DesignSectionProps): React.ReactElement {
  return (
    <FormSection title="Gestaltung">
      {issue !== undefined && <IssueText>{issue}</IssueText>}
      <ChoiceField
        label="Akzentfarbe"
        options={ACCENT_OPTIONS}
        value={value.accent}
        onChange={(accent) => onChange({ ...value, accent })}
      />
      <ChoiceField
        label="Dichte"
        options={DENSITY_OPTIONS}
        value={value.density}
        onChange={(density) => onChange({ ...value, density })}
      />
      <ChoiceField
        label="Pflichtmarke"
        options={MARKER_OPTIONS}
        value={value.requiredMarker}
        onChange={(requiredMarker) => onChange({ ...value, requiredMarker })}
        hint={detailed ? MARKER_HINT : undefined}
      />
    </FormSection>
  );
}

/** Ein Feld für eine eingefügte ID oder Adresse; übernommen wird erst, was sich als ID lesen lässt. */
function IdField({ current, onValid }: { current: string | undefined; onValid: (formId: string) => void }): React.ReactElement {
  const [text, setText] = React.useState("");
  const unreadable = text.trim() !== "" && readFormId(text) === null;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setText(event.target.value);
    const formId = readFormId(event.target.value);
    if (formId !== null && formId !== current) onValid(formId);
  };
  return (
    <Field
      label="Formular-ID oder Adresse"
      error={unreadable ? "Keine gültige ID erkannt" : undefined}
      hint={`Die 24-stellige Zeichenfolge am Ende der Formular-Adresse. Aktuell: ${current ?? "–"}`}
    >
      <Input className="h-10" value={text} onChange={handleChange} placeholder="ID oder Adresse einfügen" />
    </Field>
  );
}

export interface ManualIdSectionProps extends SectionProps {
  defaultOpen: boolean;
}

/**
 * Der Ausweg, den der Dialog schon bisher bot: fehlt ein Formular in der
 * Liste (keine Verwaltungsrechte, älter als die 100 zuletzt geänderten) oder
 * lädt sie nicht, lässt sich die ID oder die ganze Adresse einfügen.
 */
export function ManualIdSection({ value, onChange, defaultOpen }: ManualIdSectionProps): React.ReactElement {
  return (
    <FormSection
      title="ID von Hand eintragen"
      description="Nur nötig, wenn das Formular links fehlt oder die Liste nicht lädt: die ID oder die ganze Adresse des Formulars einfügen."
      collapsible
      defaultOpen={defaultOpen}
    >
      <IdField current={value.formId} onValid={(formId) => onChange({ ...value, formId })} />
    </FormSection>
  );
}
