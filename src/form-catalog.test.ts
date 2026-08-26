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

import { CATALOG_ENDPOINT, formCatalogSource } from "./form-catalog";

const entry = (id: string, localization: unknown): unknown => ({
  data: { id, config: { localization } },
});

const respondWith = (body: unknown): jest.SpyInstance =>
  jest
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }));

describe("formCatalogSource.fetchList", () => {
  afterEach(() => jest.restoreAllMocks());

  it("asks only for forms the author may actually manage", async () => {
    const fetchMock = respondWith({ total: 0, entries: [] });

    await formCatalogSource.fetchList();

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url.startsWith(CATALOG_ENDPOINT)).toBe(true);
    expect(url).toContain("permission=manage");
    expect(url).toContain("limit=100");
    expect(url).toContain("sort=updated_DESC");
    // Without the cookie the endpoint answers 401 and the list stays empty.
    expect(init.credentials).toBe("same-origin");
  });

  it("returns the raw entries as-is for toOption to map", async () => {
    respondWith({ total: 1, entries: [entry("aaaaaaaaaaaaaaaaaaaaaaaa", { en_US: { title: "Form" } })] });

    await expect(formCatalogSource.fetchList()).resolves.toEqual([
      entry("aaaaaaaaaaaaaaaaaaaaaaaa", { en_US: { title: "Form" } }),
    ]);
  });

  it("answers with an empty list when the author may not see the forms", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 403 }));

    await expect(formCatalogSource.fetchList()).resolves.toEqual([]);
  });

  it("lets a network failure propagate to the shared loader", async () => {
    // `fetchEntityCatalog` is the one that turns this into an empty list; this
    // source is not responsible for catching it itself.
    jest.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));

    await expect(formCatalogSource.fetchList()).rejects.toThrow("offline");
  });
});

describe("formCatalogSource.toOption", () => {
  afterEach(() => document.documentElement.removeAttribute("lang"));

  it("names the form in the language of the page", () => {
    document.documentElement.setAttribute("lang", "de-DE");

    expect(
      formCatalogSource.toOption(
        entry("aaaaaaaaaaaaaaaaaaaaaaaa", { en_US: { title: "Form" }, de_DE: { title: "Formular" } }) as never,
      ),
    ).toEqual({ id: "aaaaaaaaaaaaaaaaaaaaaaaa", title: "Formular" });
  });

  it("shows the id when a form carries no title at all", () => {
    expect(formCatalogSource.toOption(entry("cccccccccccccccccccccccc", {}) as never)).toEqual({
      id: "cccccccccccccccccccccccc",
      title: "cccccccccccccccccccccccc",
    });
  });

  it("skips entries without an id rather than listing a broken one", () => {
    expect(formCatalogSource.toOption({ data: { config: {} } } as never)).toBeNull();
  });
});
