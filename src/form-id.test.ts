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

import { readFormId } from "./form-id";

describe("readFormId", () => {
  it("takes a plain id, normalised to lower case", () => {
    expect(readFormId("6A85BAB79477A541319D2176")).toBe("6a85bab79477a541319d2176");
  });

  it("takes the id out of a pasted form URL", () => {
    expect(readFormId("https://www.mti.man/content/page/forms/6a85bab79477a541319d2176")).toBe(
      "6a85bab79477a541319d2176",
    );
  });

  it("takes the last id when the URL carries several", () => {
    expect(readFormId("/spaces/6891d4e0aec53f55e3a819ac/forms/6a85bab79477a541319d2176")).toBe(
      "6a85bab79477a541319d2176",
    );
  });

  it("rejects everything that carries no id", () => {
    expect(readFormId("")).toBeNull();
    expect(readFormId("   ")).toBeNull();
    expect(readFormId("kein-formular")).toBeNull();
    expect(readFormId(undefined)).toBeNull();
    expect(readFormId(42)).toBeNull();
  });
});
