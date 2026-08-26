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

import * as csrf from "./csrf-token";
import { fetchFormDefinition, fetchFormSettings, fetchOwnAnswers, submitAnswer } from "./form-client";

const FORM_ID = "6a85bab79477a541319d2176";

const respondWith = (body: unknown, status = 200): jest.SpyInstance =>
  jest
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response(JSON.stringify(body), { status }));

// The shape the plugin actually answers with, trimmed to what the client reads.
const schemaResponse = {
  version_no: 3,
  hasAnswers: 1,
  options: {
    type: "object",
    fields: {
      _0: { label: "Enter your name.", helper: "", image: "", type: "text" },
      _2: { label: "Create a page?", helper: "Pick one.", image: "", type: "radio" },
    },
  },
  schema: {
    type: "object",
    properties: {
      _0: { required: true, maxLength: 80 },
      _2: { required: true, enum: ["Yes", "No"] },
    },
  },
};

afterEach(() => jest.restoreAllMocks());

describe("fetchFormDefinition", () => {
  it("asks the form for its privacy-protected schema", async () => {
    const fetchMock = respondWith(schemaResponse);

    await fetchFormDefinition(FORM_ID);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`/plugins/forms/${FORM_ID}?eyoAction=getSchemaPrivacyProtected`);
    expect(init.method).toBe("POST");
    expect(init.credentials).toBe("same-origin");
  });

  it("merges options and schema into renderable fields, in authoring order", async () => {
    respondWith(schemaResponse);

    const definition = await fetchFormDefinition(FORM_ID);

    expect(definition.versionNo).toBe(3);
    expect(definition.fields).toEqual([
      {
        key: "_0",
        label: "Enter your name.",
        helper: "",
        image: "",
        type: "text",
        required: true,
        choices: [],
        maxLength: 80,
      },
      {
        key: "_2",
        label: "Create a page?",
        helper: "Pick one.",
        image: "",
        type: "radio",
        required: true,
        choices: ["Yes", "No"],
        maxLength: null,
      },
    ]);
  });

  it("renders an unknown field kind as free text rather than dropping it", async () => {
    respondWith({
      version_no: 1,
      options: { fields: { _0: { label: "Mystery", type: "hologram" } } },
      schema: { properties: { _0: {} } },
    });

    const definition = await fetchFormDefinition(FORM_ID);

    expect(definition.fields[0].type).toBe("text");
    expect(definition.fields[0].required).toBe(false);
  });

  it("refuses a broken endpoint loudly instead of showing an empty form", async () => {
    respondWith({}, 500);

    await expect(fetchFormDefinition(FORM_ID)).rejects.toThrow("HTTP 500");
  });
});

describe("fetchFormSettings", () => {
  it("reads the submit verdict, the one-per-person restriction and the history switch", async () => {
    respondWith({
      settings: { can_user_submit: false, submission_restriction: 1, previous_submissions: 1 },
    });

    await expect(fetchFormSettings(FORM_ID)).resolves.toEqual({
      canUserSubmit: false,
      submissionRestricted: true,
      previousSubmissions: true,
    });
  });

  it("counts an absent flag as allowed — the submit itself is still checked server-side", async () => {
    respondWith({ settings: {} });

    await expect(fetchFormSettings(FORM_ID)).resolves.toEqual({
      canUserSubmit: true,
      submissionRestricted: false,
      previousSubmissions: false,
    });
  });
});

describe("fetchOwnAnswers", () => {
  it("labels each submission with the fields of its own schema version, newest first", async () => {
    respondWith({
      data: [
        {
          version: 1,
          options: { fields: { _0: { label: "Dein Vorname" }, _1: { label: "Dein Name" } } },
          answer: [
            {
              id: 12311096,
              timestampUTC: "2026-08-26 12:21:02+00",
              formValues: { _0: "Test", _1: "Test" },
            },
            {
              id: 12311670,
              timestampUTC: "2026-08-26 13:32:41+00",
              formValues: { _0: "Anna", _1: "Berger" },
            },
          ],
        },
      ],
      limit: 100,
      total: 2,
    });

    await expect(fetchOwnAnswers(FORM_ID)).resolves.toEqual([
      {
        id: 12311670,
        timestamp: "2026-08-26 13:32:41+00",
        values: [
          { label: "Dein Vorname", value: "Anna" },
          { label: "Dein Name", value: "Berger" },
        ],
      },
      {
        id: 12311096,
        timestamp: "2026-08-26 12:21:02+00",
        values: [
          { label: "Dein Vorname", value: "Test" },
          { label: "Dein Name", value: "Test" },
        ],
      },
    ]);
  });

  it("skips entries it cannot read instead of breaking the panel", async () => {
    respondWith({
      data: [{ options: { fields: {} }, answer: [{ timestampUTC: "2026-01-01 00:00:00+00" }] }],
    });

    await expect(fetchOwnAnswers(FORM_ID)).resolves.toEqual([]);
  });
});

describe("submitAnswer", () => {
  const TOKEN = "e034109d9c21fde4d83afb86.6e664a4675cb06b5";

  beforeEach(() => {
    jest.spyOn(csrf, "resolveCsrfToken").mockResolvedValue(TOKEN);
  });

  it("posts the answers form-encoded, with the version and the CSRF token", async () => {
    const fetchMock = respondWith({
      msg: "Success",
      status: "success",
      success_message: "The form has been successfully submitted!",
    });

    const message = await submitAnswer(FORM_ID, 3, { _0: "Anna Berger", _2: "Yes" });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`/plugins/forms/${FORM_ID}?eyoAction=submitAnswer&version=3`);
    expect(init.method).toBe("POST");
    // Verified live: urlencoded answers 200, multipart FormData answers 403.
    expect(init.body).toBeInstanceOf(URLSearchParams);
    expect(String(init.body)).toBe("_0=Anna+Berger&_2=Yes");
    // Verified live as well: without this header the endpoint answers 403.
    expect((init.headers as Record<string, string>)["X-Csrf-Token"]).toBe(TOKEN);
    expect(message).toBe("The form has been successfully submitted!");
  });

  it("retries once with a fresh token when the first attempt is refused with 403", async () => {
    const resolve = jest
      .spyOn(csrf, "resolveCsrfToken")
      .mockResolvedValueOnce("stale.token")
      .mockResolvedValueOnce("fresh.token");
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response("", { status: 403 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ msg: "Success", status: "success", success_message: "ok" }), {
          status: 200,
        }),
      );

    await expect(submitAnswer(FORM_ID, 1, { _0: "x" })).resolves.toBe("ok");

    expect(resolve).toHaveBeenNthCalledWith(2, FORM_ID, { refresh: true });
    const [, secondInit] = fetchMock.mock.calls[1] as [string, RequestInit];
    expect((secondInit.headers as Record<string, string>)["X-Csrf-Token"]).toBe("fresh.token");
  });

  it("surfaces the plugin's reason when a submit is refused with an error status", async () => {
    // The same token comes back on refresh, so there is nothing left to retry.
    respondWith({ msg: "You are not allowed to submit this form", status: "error" }, 403);

    await expect(submitAnswer(FORM_ID, 1, { _0: "x" })).rejects.toThrow(
      "HTTP 403 — You are not allowed to submit this form",
    );
  });

  it("turns a rejecting plugin into an error the view can show", async () => {
    respondWith({ msg: "Submission limit reached", status: "error" });

    await expect(submitAnswer(FORM_ID, 1, { _0: "x" })).rejects.toThrow("Submission limit reached");
  });

  it("falls back to a generic thank-you when the plugin sends none", async () => {
    respondWith({ msg: "Success", status: "success", success_message: "" });

    await expect(submitAnswer(FORM_ID, 1, { _0: "x" })).resolves.toBe("Thanks, your form was sent");
  });
});
