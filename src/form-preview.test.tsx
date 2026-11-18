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

import * as React from "react";
import { render, screen } from "@testing-library/react";

import * as client from "./form-client";
import { FormPreview } from "./form-preview";

const FORM_ID = "6a85bab79477a541319d2176";

beforeEach(() => {
  jest.spyOn(client, "fetchFormDefinition").mockResolvedValue({
    versionNo: 1,
    fields: [
      { key: "_0", label: "Name", helper: "", image: "", type: "text", required: true, choices: [], maxLength: null },
    ],
  });
  jest.spyOn(client, "fetchFormSettings").mockResolvedValue({
    canUserSubmit: true,
    submissionRestricted: false,
    previousSubmissions: false,
  });
});

afterEach(() => jest.restoreAllMocks());

describe("FormPreview", () => {
  it("zeigt das echte Formular mit dem Entwurf, gesperrt für jede Eingabe", async () => {
    const submit = jest.spyOn(client, "submitAnswer");
    render(<FormPreview config={{ formId: FORM_ID, accent: "#303c49", density: "compact", requiredMarker: "text" }} />);

    expect(await screen.findByText("Name")).toBeInTheDocument();
    expect(screen.getByTestId("form-preview")).toHaveAttribute("inert");
    expect(screen.getByText("(required)")).toBeInTheDocument();
    const display = screen.getByTestId("form-display");
    expect(display.style.getPropertyValue("--fdw-accent")).toBe("#303c49");
    expect(display.style.getPropertyValue("--fdw-field-h")).toBe("36px");
    expect(client.fetchFormDefinition).toHaveBeenCalledWith(FORM_ID);
    expect(submit).not.toHaveBeenCalled();
  });

  it("zeigt offene Schlüssel mit der Vorgabe und ohne Formular den Hinweis der Seite", () => {
    render(<FormPreview config={{}} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Keine Formular-ID konfiguriert");
    expect(screen.getByTestId("form-display").style.getPropertyValue("--fdw-accent")).toBe("#e40045");
    expect(client.fetchFormDefinition).not.toHaveBeenCalled();
  });
});
