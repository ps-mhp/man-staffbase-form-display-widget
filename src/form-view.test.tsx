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
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as client from "./form-client";
import { FormDefinition } from "./form-client";
import { FormView } from "./form-view";

const FORM_ID = "6a85bab79477a541319d2176";

const definition: FormDefinition = {
  versionNo: 1,
  fields: [
    {
      key: "_0",
      label: "Your name",
      helper: "As on your badge.",
      image: "",
      type: "text",
      required: true,
      choices: [],
      maxLength: null,
    },
    {
      key: "_1",
      label: "How do you travel?",
      helper: "",
      image: "",
      type: "radio",
      required: true,
      choices: ["Own vehicle", "Shuttle"],
      maxLength: null,
    },
    {
      key: "_2",
      label: "Topics",
      helper: "",
      image: "",
      type: "checkbox",
      required: false,
      choices: ["Electric", "Digital"],
      maxLength: null,
    },
  ],
};

const defaults = { accent: "#e40045", compact: false, requiredMarker: " *" } as const;

function mockLoad(overrides?: {
  canUserSubmit?: boolean;
  submissionRestricted?: boolean;
  previousSubmissions?: boolean;
  ownAnswers?: client.OwnAnswer[];
}): void {
  jest.spyOn(client, "fetchFormDefinition").mockResolvedValue(definition);
  jest.spyOn(client, "fetchFormSettings").mockResolvedValue({
    canUserSubmit: overrides?.canUserSubmit ?? true,
    submissionRestricted: overrides?.submissionRestricted ?? false,
    previousSubmissions: overrides?.previousSubmissions ?? false,
  });
  jest.spyOn(client, "fetchOwnAnswers").mockResolvedValue(overrides?.ownAnswers ?? []);
}

const ownAnswer: client.OwnAnswer = {
  id: 12311670,
  timestamp: "2026-08-26 13:32:41+00",
  values: [{ label: "First name", value: "Anna Berger" }],
};

afterEach(() => jest.restoreAllMocks());

describe("FormView", () => {
  it("reports a missing form id without calling the plugin", () => {
    const fetchDefinition = jest.spyOn(client, "fetchFormDefinition");

    render(<FormView formId={null} {...defaults} />);

    expect(screen.getByRole("alert")).toHaveTextContent(/Formular-ID/);
    expect(fetchDefinition).not.toHaveBeenCalled();
  });

  it("renders the questions with labels, helpers and required markers", async () => {
    mockLoad();

    render(<FormView formId={FORM_ID} {...defaults} />);

    expect(await screen.findByLabelText(/Your name/)).toBeInTheDocument();
    expect(screen.getByText("As on your badge.")).toBeInTheDocument();
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getByRole("group")).toBeInTheDocument();
    // Two required fields, one marker each.
    expect(screen.getAllByText("*")).toHaveLength(2);
    expect(screen.getByText("2 of 2 required fields open")).toBeInTheDocument();
  });

  it("validates on submit only and points at every missing required field", async () => {
    mockLoad();
    const submit = jest.spyOn(client, "submitAnswer").mockResolvedValue("done");
    const user = userEvent.setup();

    render(<FormView formId={FORM_ID} {...defaults} />);
    await screen.findByLabelText(/Your name/);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(submit).not.toHaveBeenCalled();
    expect(screen.getAllByText("This field is required.")).toHaveLength(2);
  });

  it("submits the answers in the plugin's wire format and shows the thank-you", async () => {
    mockLoad();
    const submit = jest
      .spyOn(client, "submitAnswer")
      .mockResolvedValue("The form has been successfully submitted!");
    const user = userEvent.setup();

    render(<FormView formId={FORM_ID} {...defaults} />);
    await user.type(await screen.findByLabelText(/Your name/), "Anna Berger");
    // Readers click the visible label; the hidden native input only follows.
    await user.click(screen.getByText("Shuttle"));
    await user.click(screen.getByText("Electric"));
    await user.click(screen.getByText("Digital"));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(submit).toHaveBeenCalledWith(FORM_ID, 1, {
      _0: "Anna Berger",
      _1: "Shuttle",
      _2: "Electric, Digital",
    });
    expect(await screen.findByRole("status")).toHaveTextContent(
      "The form has been successfully submitted!",
    );
    // The success state replaces the whole form.
    expect(screen.queryByRole("button", { name: "Submit" })).not.toBeInTheDocument();
  });

  it("shows the plugin's refusal instead of pretending success", async () => {
    mockLoad();
    jest.spyOn(client, "submitAnswer").mockRejectedValue(new Error("Submission limit reached"));
    const user = userEvent.setup();

    render(<FormView formId={FORM_ID} {...defaults} />);
    await user.type(await screen.findByLabelText(/Your name/), "Anna");
    await user.click(screen.getByText("Shuttle"));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/Submission limit reached/);
    // The form stays on screen for another attempt.
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("tells a reader who already submitted, in the plugin's own words", async () => {
    // The one-submission-per-person restriction plus a refusal is what the
    // plugin itself reads as "already answered" — there is no count endpoint
    // in play, the host's own plugin-block does not call one either.
    mockLoad({ canUserSubmit: false, submissionRestricted: true });

    render(<FormView formId={FORM_ID} {...defaults} />);

    expect(await screen.findByRole("status")).toHaveTextContent(
      "You have already submitted this form once.",
    );
    expect(screen.queryByRole("button", { name: "Submit" })).not.toBeInTheDocument();
  });

  it("opens previous submissions in a modal and closes it again", async () => {
    mockLoad({ previousSubmissions: true, ownAnswers: [ownAnswer] });
    const user = userEvent.setup();

    render(<FormView formId={FORM_ID} {...defaults} />);

    const toggle = await screen.findByRole("button", { name: "Your previous submissions" });
    // Hidden until asked for, like the plugin's own dialog.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(toggle);

    const modal = screen.getByRole("dialog", { name: "Your previous submissions" });
    // Entries start collapsed; the values appear on demand.
    expect(modal).not.toHaveTextContent("Anna Berger");
    const entry = modal.querySelector(".form-display__answer-toggle");
    expect(entry).not.toBeNull();
    await user.click(entry!);
    expect(modal).toHaveTextContent("First name");
    expect(modal).toHaveTextContent("Anna Berger");
    await user.click(entry!);
    expect(modal).not.toHaveTextContent("Anna Berger");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(toggle);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("asks for previous submissions only when the author switched them on", async () => {
    mockLoad();

    render(<FormView formId={FORM_ID} {...defaults} />);
    await screen.findByLabelText(/Your name/);

    expect(client.fetchOwnAnswers).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("button", { name: "Your previous submissions" }),
    ).not.toBeInTheDocument();
  });

  it("offers the modal below the notice when the form is already answered", async () => {
    mockLoad({
      canUserSubmit: false,
      submissionRestricted: true,
      previousSubmissions: true,
      ownAnswers: [ownAnswer],
    });
    const user = userEvent.setup();

    render(<FormView formId={FORM_ID} {...defaults} />);

    await user.click(await screen.findByRole("button", { name: "Your previous submissions" }));

    const modal = screen.getByRole("dialog");
    await user.click(modal.querySelector(".form-display__answer-toggle")!);
    expect(modal).toHaveTextContent("Anna Berger");
  });

  it("refreshes the previous submissions after a successful submit", async () => {
    mockLoad({ previousSubmissions: true, ownAnswers: [ownAnswer] });
    jest.spyOn(client, "submitAnswer").mockResolvedValue("done");
    const user = userEvent.setup();

    render(<FormView formId={FORM_ID} {...defaults} />);
    await user.type(await screen.findByLabelText(/Your name/), "Anna");
    await user.click(screen.getByText("Shuttle"));
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await screen.findByText("done");

    // Once on load, once after the submit — and still one click away.
    expect(client.fetchOwnAnswers).toHaveBeenCalledTimes(2);
    await user.click(screen.getByRole("button", { name: "Your previous submissions" }));
    const modal = screen.getByRole("dialog");
    await user.click(modal.querySelector(".form-display__answer-toggle")!);
    expect(modal).toHaveTextContent("Anna Berger");
  });

  it("tells a reader the form is closed when no per-person restriction explains the refusal", async () => {
    mockLoad({ canUserSubmit: false });

    render(<FormView formId={FORM_ID} {...defaults} />);

    expect(await screen.findByRole("status")).toHaveTextContent(/not accepting submissions/);
  });

  it("still shows the form when the settings endpoint fails — the submit is checked server-side", async () => {
    jest.spyOn(client, "fetchFormDefinition").mockResolvedValue(definition);
    jest.spyOn(client, "fetchFormSettings").mockRejectedValue(new Error("HTTP 500"));

    render(<FormView formId={FORM_ID} {...defaults} />);

    expect(await screen.findByLabelText(/Your name/)).toBeInTheDocument();
  });

  it("reports a plugin that will not load", async () => {
    jest.spyOn(client, "fetchFormDefinition").mockRejectedValue(new Error("kaputt"));
    jest.spyOn(client, "fetchFormSettings").mockResolvedValue({
      canUserSubmit: true,
      submissionRestricted: false,
      previousSubmissions: false,
    });

    render(<FormView formId={FORM_ID} {...defaults} />);

    expect(await screen.findByRole("alert")).toHaveTextContent(/kaputt/);
  });

  it("carries the configured accent and density into the block's style", async () => {
    mockLoad();

    render(<FormView formId={FORM_ID} accent="#303c49" compact requiredMarker=" (required)" />);
    await screen.findByLabelText(/Your name/);

    const block = screen.getByTestId("form-display");
    expect(block.style.getPropertyValue("--fdw-accent")).toBe("#303c49");
    // Craft standard-primary: hover and pressed of the anthracite button.
    expect(block.style.getPropertyValue("--fdw-accent-hover")).toBe("#1e2832");
    expect(block.style.getPropertyValue("--fdw-accent-active")).toBe("#161616");
    expect(block.style.getPropertyValue("--fdw-field-h")).toBe("36px");
    expect(screen.getAllByText("(required)")).toHaveLength(2);
  });

  it("defaults to Craft's 40 px field and the accent-primary states of MAN red", async () => {
    mockLoad();

    render(<FormView formId={FORM_ID} {...defaults} />);
    await screen.findByLabelText(/Your name/);

    const block = screen.getByTestId("form-display");
    expect(block.style.getPropertyValue("--fdw-field-h")).toBe("40px");
    expect(block.style.getPropertyValue("--fdw-accent-hover")).toBe("#ad0040");
    expect(block.style.getPropertyValue("--fdw-accent-active")).toBe("#8a003b");
  });

  it("resets typed answers and validation marks", async () => {
    mockLoad();
    const user = userEvent.setup();

    render(<FormView formId={FORM_ID} {...defaults} />);
    const name = await screen.findByLabelText(/Your name/);
    await user.type(name, "Anna");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(name).toHaveValue("");
    expect(screen.queryByText("This field is required.")).not.toBeInTheDocument();
  });

  it("drops a submit outcome that arrives after the configuration changed", async () => {
    mockLoad();
    let resolveSubmit: (message: string) => void = () => undefined;
    jest
      .spyOn(client, "submitAnswer")
      .mockReturnValue(new Promise((resolve) => (resolveSubmit = resolve)));
    const user = userEvent.setup();

    const { rerender } = render(<FormView formId={FORM_ID} {...defaults} />);
    await user.type(await screen.findByLabelText(/Your name/), "Anna");
    await user.click(screen.getByText("Shuttle"));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    // The author picks another form while the submit is still in flight.
    rerender(<FormView formId="ffffffffffffffffffffffff" {...defaults} />);
    await screen.findByLabelText(/Your name/);
    resolveSubmit("stale success");

    await waitFor(() =>
      // The new form stays interactive; the stale outcome is not shown.
      expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled(),
    );
    expect(screen.queryByText("stale success")).not.toBeInTheDocument();
  });

  it("announces the loading and ready states to screen readers", async () => {
    mockLoad();

    const { container } = render(<FormView formId={FORM_ID} {...defaults} />);
    const region = container.querySelector(".form-display__sr-only");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveTextContent("Loading form …");

    await screen.findByLabelText(/Your name/);
    expect(region).toHaveTextContent("Form loaded.");
  });

  it("adds the widget stylesheet to the document exactly once", async () => {
    mockLoad();

    render(
      <>
        <FormView formId={FORM_ID} {...defaults} />
        <FormView formId={FORM_ID} {...defaults} />
      </>,
    );

    await waitFor(() =>
      expect(document.querySelectorAll("#form-display-widget-styles")).toHaveLength(1),
    );
  });
});
