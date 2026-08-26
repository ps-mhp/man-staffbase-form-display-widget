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

import { resolveCsrfToken } from "./csrf-token";

/** Where a single form installation answers its `eyoAction` calls. */
export const FORMS_BASE_PATH = "/plugins/forms";

/** The field kinds this widget knows how to render. */
export type FormFieldType = "text" | "textarea" | "date" | "select" | "radio" | "checkbox";

/** One question of the form, merged from the plugin's options and schema. */
export interface FormField {
  /** The submission key, e.g. `_0` — also the name the value is posted under. */
  key: string;
  label: string;
  helper: string;
  /** An illustration the author attached to the question; empty when none. */
  image: string;
  type: FormFieldType;
  required: boolean;
  /** The offered answers for choice fields; empty for free-text fields. */
  choices: string[];
  /** Character cap for text fields; `null` when the author set none. */
  maxLength: number | null;
}

export interface FormDefinition {
  /** Sent back on submit so the answer lands with the right schema version. */
  versionNo: number;
  fields: FormField[];
}

export interface FormSettings {
  /** The server's own verdict on whether this user may submit right now. */
  canUserSubmit: boolean;
  /** Whether the author limited the form to one submission per person. */
  submissionRestricted: boolean;
  /** Whether the author lets readers see their previous submissions. */
  previousSubmissions: boolean;
}

/** One value of a previous submission, already labelled for display. */
export interface OwnAnswerValue {
  label: string;
  value: string;
}

/** One previous submission of the reader, newest first in the list. */
export interface OwnAnswer {
  id: number;
  /** As the plugin reports it, e.g. `2026-08-26 13:32:41+00`. */
  timestamp: string;
  values: OwnAnswerValue[];
}

interface RawFieldOptions {
  label?: unknown;
  helper?: unknown;
  image?: unknown;
  type?: unknown;
}

interface RawSchemaProperty {
  required?: unknown;
  enum?: unknown;
  maxLength?: unknown;
}

interface RawSchemaResponse {
  version_no?: unknown;
  options?: { fields?: Record<string, RawFieldOptions> };
  schema?: { properties?: Record<string, RawSchemaProperty> };
}

interface RawSettingsResponse {
  settings?: {
    can_user_submit?: unknown;
    submission_restriction?: unknown;
    previous_submissions?: unknown;
  };
}

interface RawOwnAnswersEntry {
  options?: { fields?: Record<string, RawFieldOptions> };
  answer?: { id?: unknown; timestampUTC?: unknown; formValues?: unknown }[];
}

interface RawOwnAnswersResponse {
  data?: RawOwnAnswersEntry[];
}

interface RawSubmitResponse {
  status?: unknown;
  msg?: unknown;
  success_message?: unknown;
}

/**
 * One `eyoAction` call against a form installation.
 *
 * The plugin routes on the query string alone; the actions this widget uses
 * take no request body except `submitAnswer`, whose body the caller passes in.
 */
async function callFormAction(
  formId: string,
  params: Record<string, string>,
  body?: URLSearchParams,
): Promise<unknown> {
  const query = new URLSearchParams(params);
  const response = await fetch(`${FORMS_BASE_PATH}/${formId}?${query}`, {
    method: "POST",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
    body,
  });
  if (!response.ok) await throwHttpError(response);
  return response.json() as Promise<unknown>;
}

/**
 * Turns a non-2xx response into an error worth showing.
 *
 * The plugin explains a refusal (e.g. "already submitted") in the body; that
 * reason is worth more to the reader than the bare status code.
 */
async function throwHttpError(response: Response): Promise<never> {
  let detail = "";
  try {
    const reason = (await response.json()) as { msg?: unknown };
    if (typeof reason.msg === "string" && reason.msg !== "") detail = ` — ${reason.msg}`;
  } catch {
    // Not JSON; the status alone will have to do.
  }
  throw new Error(`Formular-Endpunkt antwortete mit HTTP ${response.status}${detail}.`);
}

/** The plugin's field types, folded onto what this widget can render. */
function readFieldType(raw: unknown): FormFieldType {
  switch (raw) {
    case "textarea":
    case "paragraph":
      return "textarea";
    case "date":
      return "date";
    case "select":
    case "dropdown":
      return "select";
    case "radio":
      return "radio";
    case "checkbox":
      return "checkbox";
    default:
      // Unknown kinds still get a usable input rather than a hole in the
      // form — a free-text answer beats a question that cannot be answered.
      return "text";
  }
}

function readString(raw: unknown, fallback: string): string {
  return typeof raw === "string" ? raw : fallback;
}

function toField(key: string, options: RawFieldOptions, property: RawSchemaProperty): FormField {
  const choices = Array.isArray(property.enum)
    ? property.enum.filter((entry): entry is string => typeof entry === "string")
    : [];

  return {
    key,
    label: readString(options.label, key),
    helper: readString(options.helper, ""),
    image: readString(options.image, ""),
    type: readFieldType(options.type),
    required: property.required === true,
    choices,
    maxLength: typeof property.maxLength === "number" ? property.maxLength : null,
  };
}

/**
 * The form as the plugin hands it to readers: questions, answer options and
 * the schema version — already in the reader's language, the server resolves
 * the translation before answering.
 */
export async function fetchFormDefinition(formId: string): Promise<FormDefinition> {
  const body = (await callFormAction(formId, {
    eyoAction: "getSchemaPrivacyProtected",
  })) as RawSchemaResponse;

  const rawFields = body.options?.fields ?? {};
  const properties = body.schema?.properties ?? {};

  return {
    versionNo: typeof body.version_no === "number" ? body.version_no : 1,
    // The plugin keys its questions `_0`, `_1`, … and delivers them in
    // authoring order; that order is kept as-is.
    fields: Object.entries(rawFields).map(([key, options]) =>
      toField(key, options, properties[key] ?? {}),
    ),
  };
}

/**
 * Whether the reader may submit, as the server decides it.
 *
 * A response without the flag (an older plugin version) counts as allowed:
 * the submission itself is still validated server-side, so nothing is lost —
 * while a false negative would hide a working form.
 */
export async function fetchFormSettings(formId: string): Promise<FormSettings> {
  const body = (await callFormAction(formId, { eyoAction: "getSettings" })) as RawSettingsResponse;
  const isOn = (value: unknown): boolean => value === 1 || value === "1" || value === true;
  return {
    canUserSubmit: body.settings?.can_user_submit !== false,
    submissionRestricted: isOn(body.settings?.submission_restriction),
    previousSubmissions: isOn(body.settings?.previous_submissions),
  };
}

/**
 * The reader's own previous submissions, newest first.
 *
 * The plugin answers one entry per schema version, each carrying the field
 * labels of that version and the submissions made against it — so an answer
 * is always read with the labels it was given under, even after the form
 * changed. Flattened here into one list for display.
 */
export async function fetchOwnAnswers(formId: string): Promise<OwnAnswer[]> {
  const body = (await callFormAction(formId, {
    eyoAction: "getOwnAnswers",
  })) as RawOwnAnswersResponse;

  const all: OwnAnswer[] = [];
  for (const entry of body.data ?? []) {
    const fields = entry.options?.fields ?? {};
    for (const answer of entry.answer ?? []) {
      if (typeof answer.id !== "number") continue;
      const formValues =
        typeof answer.formValues === "object" && answer.formValues !== null
          ? (answer.formValues as Record<string, unknown>)
          : {};

      const keys = Object.keys(fields).length > 0 ? Object.keys(fields) : Object.keys(formValues);
      all.push({
        id: answer.id,
        timestamp: readString(answer.timestampUTC, ""),
        values: keys
          .filter((key) => key in formValues)
          .map((key) => ({
            label: readString(fields[key]?.label, key),
            value: typeof formValues[key] === "string" ? (formValues[key] as string) : "",
          })),
      });
    }
  }
  // The timestamps sort lexically (`YYYY-MM-DD hh:mm:ss`), newest first.
  return all.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

/** The submit request itself; separated so the 403 retry can repeat it. */
function postSubmit(
  formId: string,
  versionNo: number,
  values: Record<string, string>,
  token: string | null,
): Promise<Response> {
  const query = new URLSearchParams({ eyoAction: "submitAnswer", version: String(versionNo) });
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token !== null) headers["X-Csrf-Token"] = token;

  return fetch(`${FORMS_BASE_PATH}/${formId}?${query}`, {
    method: "POST",
    credentials: "same-origin",
    headers,
    body: new URLSearchParams(values),
  });
}

/**
 * Sends the reader's answers.
 *
 * The wire format is form-encoded pairs of the field keys (`_0`, `_1`, …)
 * with the schema version in the query, plus the session's CSRF token.
 * All three parts are verified against the live plugin: urlencoded answers
 * 200 where multipart is refused, and without `X-Csrf-Token` the endpoint
 * answers 403 no matter the body. A 403 despite a token gets one retry with
 * a freshly resolved token before the refusal is surfaced. The returned
 * message is the author's configured thank-you text.
 */
export async function submitAnswer(
  formId: string,
  versionNo: number,
  values: Record<string, string>,
): Promise<string> {
  const token = await resolveCsrfToken(formId);
  let response = await postSubmit(formId, versionNo, values, token);

  if (response.status === 403) {
    const fresh = await resolveCsrfToken(formId, { refresh: true });
    if (fresh !== null && fresh !== token) {
      response = await postSubmit(formId, versionNo, values, fresh);
    }
  }
  if (!response.ok) await throwHttpError(response);

  const body = (await response.json()) as RawSubmitResponse;
  if (body.status !== "success") {
    const reason = typeof body.msg === "string" ? body.msg : "Unbekannter Fehler.";
    throw new Error(reason);
  }
  return typeof body.success_message === "string" && body.success_message !== ""
    ? body.success_message
    : "Thanks, your form was sent";
}
