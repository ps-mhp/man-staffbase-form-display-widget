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

import React from "react";
import { createPortal } from "react-dom";

import * as client from "./form-client";
import { FormDefinition, FormField, OwnAnswer } from "./form-client";
import { ensureStyles } from "./styles";

/** Author-facing, so German like the configuration dialog. */
const MISSING_ID =
  "Keine Formular-ID konfiguriert. Bitte das Formular in den Widget-Einstellungen auswählen.";

// Reader-facing copy is English, as the design specifies for surface texts.
const LOAD_FAILED = "The form could not be loaded";
// The plugin's own wording for the same state, so both render paths agree.
const ALREADY_SUBMITTED = "You have already submitted this form once.";
const SUBMISSIONS_CLOSED = "This form is currently not accepting submissions.";
const REQUIRED_MESSAGE = "This field is required.";
const SUBMIT_FAILED = "The form could not be submitted";
const TEXT_PLACEHOLDER = "Add your answer";
const SELECT_PLACEHOLDER = "Please select …";

/**
 * Hover and active shades per configurable accent.
 *
 * Fixed pairs from Craft's button states rather than a computed darkening, so
 * the states always land on CI colours: red as accent-primary
 * (#e40045→#ad0040→#8a003b), anthracite as standard-primary
 * (#303c49→#1e2832→#161616), black → black.
 */
const ACCENT_SHADES: Record<string, { hover: string; active: string }> = {
  "#e40045": { hover: "#ad0040", active: "#8a003b" },
  "#303c49": { hover: "#1e2832", active: "#161616" },
  "#12171c": { hover: "#000000", active: "#000000" },
};

export interface FormViewProps {
  formId: string | null;
  /** The accent for CTA, required marker and selection cores. */
  accent: string;
  /** 36 px field height instead of Craft's 40 px. */
  compact: boolean;
  /** Appended to required labels, e.g. " *" or " (required)". */
  requiredMarker: string;
}

type Value = string | string[];

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "blocked"; message: string }
  | { status: "ready"; definition: FormDefinition };

function isEmpty(value: Value | undefined): boolean {
  if (value === undefined) return true;
  return Array.isArray(value) ? value.length === 0 : value.trim() === "";
}

/** The wire value per field: checkbox answers joined, everything else as-is. */
function serializeValues(fields: FormField[], values: Record<string, Value>): Record<string, string> {
  const entries = fields.map((field) => {
    const value = values[field.key];
    return [field.key, Array.isArray(value) ? value.join(", ") : (value ?? "")] as const;
  });
  return Object.fromEntries(entries);
}

function ErrorIcon(): React.JSX.Element {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16.5v.5" />
    </svg>
  );
}

interface ChoiceGroupProps {
  field: FormField;
  groupName: string;
  value: Value | undefined;
  error: boolean;
  labelId: string;
  describedBy: string | undefined;
  onChange: (value: Value) => void;
  inputRef: (element: HTMLElement | null) => void;
}

/**
 * Single and multiple choice as Craft draws them, in a 20 px box: round with
 * a 12 px dot for radio, square with a 16 px check for checkbox. The native
 * input stays in the DOM (visually hidden) so keyboard and screen reader
 * behaviour remain the browser's own.
 */
function ChoiceGroup({ field, groupName, value, error, labelId, describedBy, onChange, inputRef }: ChoiceGroupProps): React.JSX.Element {
  const multiple = field.type === "checkbox";
  const selected = multiple ? (Array.isArray(value) ? value : []) : value;

  const toggle = (choice: string): void => {
    if (!multiple) {
      onChange(choice);
      return;
    }
    const list = Array.isArray(value) ? value : [];
    onChange(list.includes(choice) ? list.filter((entry) => entry !== choice) : [...list, choice]);
  };

  return (
    <div
      className={`form-display__choices${error ? " form-display__choices--error" : ""}`}
      role={multiple ? "group" : "radiogroup"}
      aria-labelledby={labelId}
      aria-describedby={describedBy}
    >
      {field.choices.map((choice, index) => {
        const checked = multiple ? (selected as string[]).includes(choice) : selected === choice;
        return (
          <label key={choice} className="form-display__choice">
            <input
              className="form-display__choice-input"
              type={multiple ? "checkbox" : "radio"}
              name={`${groupName}-${field.key}`}
              value={choice}
              checked={checked}
              onChange={() => toggle(choice)}
              ref={index === 0 ? inputRef : undefined}
            />
            <span className="form-display__choice-box" aria-hidden="true">
              {checked && !multiple && <span className="form-display__choice-core" />}
              {checked && multiple && (
                <svg className="form-display__choice-check" width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="3">
                  <path d="M5 12.5l4.5 4.5L19 7" />
                </svg>
              )}
            </span>
            <span>{choice}</span>
          </label>
        );
      })}
    </div>
  );
}

interface FieldControlProps {
  field: FormField;
  groupName: string;
  value: Value | undefined;
  error: boolean;
  requiredMarker: string;
  onChange: (value: Value) => void;
  inputRef: (element: HTMLElement | null) => void;
}

function FieldControl({ field, groupName, value, error, requiredMarker, onChange, inputRef }: FieldControlProps): React.JSX.Element {
  const fieldId = `${groupName}-${field.key}`;
  const labelId = `${fieldId}-label`;
  const errorId = `${fieldId}-error`;
  const describedBy = error ? errorId : undefined;
  const choice = field.type === "radio" || field.type === "checkbox";
  const text = typeof value === "string" ? value : "";
  const errorClass = (base: string): string => `${base}${error ? ` ${base}--error` : ""}`;

  return (
    <div className="form-display__field">
      <label className="form-display__label" id={labelId} htmlFor={choice ? undefined : fieldId}>
        {field.label}
        {field.required && <span className="form-display__required">{requiredMarker}</span>}
      </label>
      {field.image !== "" && <img className="form-display__image" src={field.image} alt="" />}

      {field.type === "text" && (
        <input
          id={fieldId}
          className={errorClass("form-display__input")}
          type="text"
          placeholder={TEXT_PLACEHOLDER}
          maxLength={field.maxLength ?? undefined}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error || undefined}
          aria-describedby={describedBy}
          ref={inputRef}
        />
      )}
      {field.type === "date" && (
        <input
          id={fieldId}
          className={`${errorClass("form-display__input")} form-display__input--date`}
          type="date"
          value={text}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error || undefined}
          aria-describedby={describedBy}
          ref={inputRef}
        />
      )}
      {field.type === "textarea" && (
        <textarea
          id={fieldId}
          className={errorClass("form-display__textarea")}
          rows={4}
          placeholder={TEXT_PLACEHOLDER}
          maxLength={field.maxLength ?? undefined}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error || undefined}
          aria-describedby={describedBy}
          ref={inputRef}
        />
      )}
      {field.type === "select" && (
        <div className="form-display__select-wrap">
          <select
            id={fieldId}
            className={errorClass("form-display__select")}
            value={text}
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={error || undefined}
            aria-describedby={describedBy}
            ref={inputRef}
          >
            <option value="">{SELECT_PLACEHOLDER}</option>
            {field.choices.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
          <span className="form-display__select-arrow" aria-hidden="true" />
        </div>
      )}
      {choice && (
        <ChoiceGroup
          field={field}
          groupName={groupName}
          value={value}
          error={error}
          labelId={labelId}
          describedBy={describedBy}
          onChange={onChange}
          inputRef={inputRef}
        />
      )}

      {field.maxLength !== null && field.type !== "date" && !choice && (
        <span className="form-display__counter">
          {text.length} / {field.maxLength}
        </span>
      )}
      {field.helper !== "" && <span className="form-display__helper">{field.helper}</span>}
      {error && (
        <span className="form-display__field-error" id={errorId} role="alert">
          <ErrorIcon />
          <span>{REQUIRED_MESSAGE}</span>
        </span>
      )}
    </div>
  );
}

/** The plugin's timestamp (`2026-08-26 13:32:41+00`), shown in local time. */
function formatTimestamp(raw: string): string {
  const parsed = new Date(raw.replace(" ", "T").replace(/\+00$/, "Z"));
  return Number.isNaN(parsed.getTime()) ? raw : parsed.toLocaleString();
}

interface OwnAnswersModalProps {
  answers: OwnAnswer[];
  onClose: () => void;
}

/**
 * The reader's previous submissions, in a modal over a backdrop — the same
 * pattern the plugin itself uses. Rendered through a portal so no ancestor
 * with `overflow` or a stacking context can clip or trap it.
 */
function OwnAnswersModal({ answers, onClose }: OwnAnswersModalProps): React.JSX.Element {
  const dialog = React.useRef<HTMLDivElement>(null);
  // Collapsed by default: on a long form, five expanded submissions are a
  // wall of text. Every entry can be open at once, though.
  const [openIds, setOpenIds] = React.useState<ReadonlySet<number>>(new Set());

  const toggleAnswer = (id: number): void => {
    setOpenIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  React.useEffect(() => {
    // Portaled to `document.body`, so it needs the stylesheet in the document
    // too — the block's own copy may sit in a shadow root it cannot see.
    ensureStyles();
    dialog.current?.focus();
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <div className="form-display__modal-backdrop" onClick={onClose}>
      <div
        className="form-display__modal"
        role="dialog"
        aria-modal="true"
        aria-label="Your previous submissions"
        ref={dialog}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="form-display__modal-head">
          <h3 className="form-display__modal-title">Your previous submissions</h3>
          <button type="button" className="form-display__modal-close" aria-label="Close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="form-display__modal-body">
          {answers.map((answer) => {
            const open = openIds.has(answer.id);
            return (
              <div key={answer.id} className="form-display__answer">
                <button
                  type="button"
                  className="form-display__answer-toggle"
                  aria-expanded={open}
                  onClick={() => toggleAnswer(answer.id)}
                >
                  <span>{formatTimestamp(answer.timestamp)}</span>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                    <path d="M1 1.5L6 6.5l5-5" />
                  </svg>
                </button>
                {open &&
                  answer.values.map((entry) => (
                    <div key={entry.label} className="form-display__answer-row">
                      <span className="form-display__answer-label">{entry.label}</span>
                      <span className="form-display__answer-value">{entry.value}</span>
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function SuccessPanel({ message }: { message: string }): React.JSX.Element {
  return (
    <div className="form-display__success" role="status">
      <span className="form-display__success-icon">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7" />
        </svg>
      </span>
      <span className="form-display__success-title">{message}</span>
    </div>
  );
}

/**
 * A Staffbase form, fetched from the forms plugin and rendered in MAN CI.
 *
 * Validation runs on submit only, never per keystroke; afterwards the focus
 * jumps to the first field still missing. The success state replaces the
 * whole form, as the design specifies.
 */
export function FormView({ formId, accent, compact, requiredMarker }: FormViewProps): React.JSX.Element {
  const groupName = React.useId();
  const [load, setLoad] = React.useState<LoadState>(
    formId === null ? { status: "error", message: MISSING_ID } : { status: "loading" },
  );
  const [values, setValues] = React.useState<Record<string, Value>>({});
  const [errors, setErrors] = React.useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [previousEnabled, setPreviousEnabled] = React.useState(false);
  const [ownAnswers, setOwnAnswers] = React.useState<OwnAnswer[]>([]);
  const [showAnswers, setShowAnswers] = React.useState(false);
  const fieldRefs = React.useRef(new Map<string, HTMLElement>());
  // Which form the block currently shows — a submit still in flight for a
  // previous form must not write its outcome over the new one.
  const activeFormId = React.useRef(formId);

  // A ref, not an effect on the document: the stylesheet has to land in the
  // root this element was rendered into, which is a shadow root in the
  // Content Designer (see `@shared/style-root`).
  const anchorStyles = React.useCallback((element: HTMLElement | null) => {
    if (element !== null) ensureStyles(element);
  }, []);

  /** Fills the previous-submissions panel; a failure just leaves it empty. */
  const loadOwnAnswers = (id: string): void => {
    client
      .fetchOwnAnswers(id)
      .then((answers) => {
        if (activeFormId.current === id) setOwnAnswers(answers);
      })
      .catch(() => undefined);
  };

  React.useEffect(() => {
    activeFormId.current = formId;
    if (formId === null) {
      setLoad({ status: "error", message: MISSING_ID });
      return;
    }

    // A changed configuration makes the running load's outcome the wrong one;
    // the flag keeps it from writing over the newer state.
    let current = true;
    setLoad({ status: "loading" });
    setValues({});
    setErrors({});
    setSubmitting(false);
    setSubmitError(null);
    setSuccessMessage(null);
    setPreviousEnabled(false);
    setOwnAnswers([]);
    setShowAnswers(false);

    // The same two calls the host's own plugin-block makes, in the same
    // order — and only these. Only the schema is load-bearing: the settings
    // merely gate the form, and a submit is validated server-side anyway, so
    // a failed settings call degrades to "may submit" and shows a working
    // form instead of an error.
    Promise.all([
      client.fetchFormDefinition(formId),
      client.fetchFormSettings(formId).catch(() => ({
        canUserSubmit: true,
        submissionRestricted: false,
        previousSubmissions: false,
      })),
    ])
      .then(([definition, settings]) => {
        if (!current) return;
        setPreviousEnabled(settings.previousSubmissions);
        if (settings.previousSubmissions) loadOwnAnswers(formId);
        if (!settings.canUserSubmit) {
          // With the one-submission-per-person restriction on, a refusal
          // means the reader already answered; anything else is a form that
          // simply is not open for submissions.
          setLoad({
            status: "blocked",
            message: settings.submissionRestricted ? ALREADY_SUBMITTED : SUBMISSIONS_CLOSED,
          });
          return;
        }
        setLoad({ status: "ready", definition });
      })
      .catch((error: unknown) => {
        if (!current) return;
        const reason = error instanceof Error ? error.message : String(error);
        setLoad({ status: "error", message: `${LOAD_FAILED}: ${reason}` });
      });

    return () => {
      current = false;
    };
  }, [formId]);

  const shades = ACCENT_SHADES[accent] ?? ACCENT_SHADES["#e40045"];
  const style = {
    "--fdw-accent": accent,
    "--fdw-accent-hover": shades.hover,
    "--fdw-accent-active": shades.active,
    "--fdw-field-h": compact ? "36px" : "40px",
  } as React.CSSProperties;

  const setValue = (key: string, value: Value): void => {
    setValues((previous) => ({ ...previous, [key]: value }));
    // The submit-time verdict stands until the field is touched again.
    setErrors((previous) => (previous[key] ? { ...previous, [key]: false } : previous));
  };

  const handleSubmit = (event: React.FormEvent, definition: FormDefinition): void => {
    event.preventDefault();
    if (formId === null || submitting) return;

    const missing = definition.fields.filter((field) => field.required && isEmpty(values[field.key]));
    if (missing.length > 0) {
      setErrors(Object.fromEntries(missing.map((field) => [field.key, true])));
      fieldRefs.current.get(missing[0].key)?.focus();
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    client
      .submitAnswer(formId, definition.versionNo, serializeValues(definition.fields, values))
      .then((message) => {
        if (activeFormId.current !== formId) return;
        setSuccessMessage(message);
        // The fresh submission belongs in the panel right away.
        if (previousEnabled) loadOwnAnswers(formId);
      })
      .catch((error: unknown) => {
        if (activeFormId.current !== formId) return;
        const reason = error instanceof Error ? error.message : String(error);
        setSubmitError(`${SUBMIT_FAILED}: ${reason}`);
      })
      .finally(() => {
        if (activeFormId.current === formId) setSubmitting(false);
      });
  };

  const handleReset = (): void => {
    setValues({});
    setErrors({});
    setSubmitError(null);
  };

  // One opener for all three places it can appear: the footer of the open
  // form, and below the blocked notice or the success panel, where there is
  // no footer.
  const answersButton =
    previousEnabled && ownAnswers.length > 0 ? (
      <button
        type="button"
        className="form-display__button"
        aria-haspopup="dialog"
        onClick={() => setShowAnswers(true)}
      >
        Your previous submissions
      </button>
    ) : null;

  const body = (): React.JSX.Element => {
    if (load.status === "loading") return <p className="form-display__status">Loading form …</p>;
    if (load.status === "error") {
      return (
        <p className="form-display__error" role="alert">
          {load.message}
        </p>
      );
    }
    if (load.status === "blocked") {
      return (
        <>
          <p className="form-display__notice" role="status">
            {load.message}
          </p>
          {answersButton !== null && <div className="form-display__answers-cta">{answersButton}</div>}
        </>
      );
    }
    if (successMessage !== null) {
      return (
        <>
          <SuccessPanel message={successMessage} />
          {answersButton !== null && <div className="form-display__answers-cta">{answersButton}</div>}
        </>
      );
    }

    const { definition } = load;
    const open = definition.fields.filter((field) => field.required && isEmpty(values[field.key])).length;
    const required = definition.fields.filter((field) => field.required).length;

    return (
      <form noValidate onSubmit={(event) => handleSubmit(event, definition)}>
        <div className="form-display__fields">
          {definition.fields.map((field) => (
            <FieldControl
              key={field.key}
              field={field}
              groupName={groupName}
              value={values[field.key]}
              error={errors[field.key] === true}
              requiredMarker={requiredMarker}
              onChange={(value) => setValue(field.key, value)}
              inputRef={(element) => {
                if (element === null) fieldRefs.current.delete(field.key);
                else fieldRefs.current.set(field.key, element);
              }}
            />
          ))}
        </div>
        <div className="form-display__footer">
          {submitError !== null && (
            <span className="form-display__submit-error" role="alert">
              <ErrorIcon />
              <span>{submitError}</span>
            </span>
          )}
          {required > 0 && (
            <span className="form-display__footer-note">
              {open} of {required} required fields open
            </span>
          )}
          <div className="form-display__actions">
            {answersButton}
            <button type="button" className="form-display__button" onClick={handleReset} disabled={submitting}>
              Reset
            </button>
            <button type="submit" className="form-display__button form-display__button--primary" disabled={submitting}>
              Submit
            </button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div ref={anchorStyles} className="form-display" data-testid="form-display" style={style}>
      <div className="form-display__form">
        {/* Persistent live region: the loading → ready swap has no alert of
            its own, so screen readers would otherwise not hear it finish. */}
        <span className="form-display__sr-only" aria-live="polite">
          {load.status === "loading" ? "Loading form …" : load.status === "ready" ? "Form loaded." : ""}
        </span>
        {body()}
      </div>
      {showAnswers && ownAnswers.length > 0 && (
        <OwnAnswersModal answers={ownAnswers} onClose={() => setShowAnswers(false)} />
      )}
    </div>
  );
}
