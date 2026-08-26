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

import { extractCsrfToken, resetCsrfTokenForTests, resolveCsrfToken } from "./csrf-token";

const FORM_ID = "6a8ed821faccc16fca46dd86";
const TOKEN = "e034109d9c21fde4d83afb86c2b560d7.6e664a4675cb06b5bb0b456a08b94043";

afterEach(() => {
  jest.restoreAllMocks();
  resetCsrfTokenForTests();
  document.querySelectorAll("meta").forEach((meta) => meta.remove());
  delete (window as unknown as Record<string, unknown>).csrfToken;
});

describe("extractCsrfToken", () => {
  it("reads a meta tag, in either attribute order", () => {
    expect(extractCsrfToken(`<meta name="csrf-token" content="${TOKEN}">`)).toBe(TOKEN);
    expect(extractCsrfToken(`<meta content="${TOKEN}" name="csrf-token">`)).toBe(TOKEN);
  });

  it("reads a hidden form field", () => {
    expect(extractCsrfToken(`<input type="hidden" name="_csrf" value="${TOKEN}">`)).toBe(TOKEN);
  });

  it("reads a script assignment, but only a value shaped like a token", () => {
    expect(extractCsrfToken(`<script>var config = { csrfToken: "${TOKEN}" };</script>`)).toBe(TOKEN);
    // Prose mentioning csrf must not become a token.
    expect(extractCsrfToken("<p>Learn about csrf: \"protection\" here.</p>")).toBeNull();
  });

  it("gives up on a page without one", () => {
    expect(extractCsrfToken("<html><body>nothing here</body></html>")).toBeNull();
  });
});

describe("resolveCsrfToken", () => {
  it("prefers a meta tag on the hosting page — no request needed", async () => {
    const meta = document.createElement("meta");
    meta.name = "csrf-token";
    meta.content = TOKEN;
    document.head.appendChild(meta);
    const fetchMock = jest.spyOn(globalThis, "fetch");

    await expect(resolveCsrfToken(FORM_ID)).resolves.toBe(TOKEN);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("takes a global the host exposes", async () => {
    (window as unknown as Record<string, unknown>).csrfToken = TOKEN;

    await expect(resolveCsrfToken(FORM_ID)).resolves.toBe(TOKEN);
  });

  it("falls back to the plugin's own page and caches what it found", async () => {
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(`<script>window.config = { csrfToken: "${TOKEN}" };</script>`, { status: 200 }),
      );

    await expect(resolveCsrfToken(FORM_ID)).resolves.toBe(TOKEN);
    expect(fetchMock.mock.calls[0][0]).toBe(`/plugins/forms/${FORM_ID}`);

    // The second ask is answered from the cache.
    await expect(resolveCsrfToken(FORM_ID)).resolves.toBe(TOKEN);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("asks the sources again on refresh — the cached token has expired", async () => {
    const fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(`<meta name="csrf-token" content="stale.0123456789abcdef">`, { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(`<meta name="csrf-token" content="${TOKEN}">`, { status: 200 }),
      );

    await expect(resolveCsrfToken(FORM_ID)).resolves.toBe("stale.0123456789abcdef");
    await expect(resolveCsrfToken(FORM_ID, { refresh: true })).resolves.toBe(TOKEN);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("answers null when no source carries a token", async () => {
    jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("<html>plain page</html>", { status: 200 }));

    await expect(resolveCsrfToken(FORM_ID)).resolves.toBeNull();
  });
});
