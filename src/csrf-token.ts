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
 * The CSRF token `submitAnswer` must carry.
 *
 * Verified against the live app: the plugin's own submit sends an
 * `X-Csrf-Token` header and answers 200; the identical request without it is
 * refused with 403. The read actions (`getSchemaPrivacyProtected` etc.) work
 * without the token.
 *
 * The token is not handed to widgets by the SDK, so it is looked for where
 * the app or the plugin put it: a `<meta>` tag or global on the hosting page,
 * and failing that the plugin's own page, which must deliver the token to its
 * frontend somehow. Every source is a bet on host internals — kept in one
 * file, like `config-field-injector` keeps its own bet.
 */

/** How a Staffbase CSRF token looks: two runs of hex, joined by a dot. */
const TOKEN_SHAPE = /[0-9a-f]{16,}\.[0-9a-f]{8,}/i;

/** `<meta>` names commonly carrying the token. */
const META_SELECTOR = 'meta[name="csrf-token"], meta[name="x-csrf-token"], meta[name="_csrf"]';

/** The one token per session; a submit refused with 403 invalidates it. */
let cached: string | null = null;

/** Drops the cached token so tests start clean. */
export function resetCsrfTokenForTests(): void {
  cached = null;
}

function fromMeta(): string | null {
  const content = document.querySelector(META_SELECTOR)?.getAttribute("content")?.trim();
  return content ? content : null;
}

function fromGlobals(): string | null {
  const globals = window as unknown as Record<string, unknown>;
  for (const name of ["csrfToken", "__CSRF_TOKEN__", "_csrfToken"]) {
    const value = globals[name];
    if (typeof value === "string" && value !== "") return value;
  }
  return null;
}

/** The token out of a page's HTML, wherever it sits in markup or script. */
export function extractCsrfToken(html: string): string | null {
  const meta = html.match(
    /<meta[^>]*name=["'](?:csrf-token|x-csrf-token|_csrf)["'][^>]*content=["']([^"']+)["']/i,
  );
  if (meta !== null) return meta[1];

  const metaReversed = html.match(
    /<meta[^>]*content=["']([^"']+)["'][^>]*name=["'](?:csrf-token|x-csrf-token|_csrf)["']/i,
  );
  if (metaReversed !== null) return metaReversed[1];

  const input = html.match(/name=["']_?csrf[^"']*["'][^>]*value=["']([^"']+)["']/i);
  if (input !== null) return input[1];

  // A script assignment like `csrfToken: "…"` or `csrf_token = '…'`, with the
  // value constrained to the token's shape so this cannot latch onto prose.
  const script = html.match(
    new RegExp(`csrf[\\w-]{0,20}["']?\\s*[:=]\\s*["'](${TOKEN_SHAPE.source})["']`, "i"),
  );
  return script === null ? null : script[1];
}

async function fromPluginPage(formId: string): Promise<string | null> {
  try {
    const response = await fetch(`/plugins/forms/${formId}`, {
      credentials: "same-origin",
      headers: { Accept: "text/html" },
    });
    if (!response.ok) return null;
    return extractCsrfToken(await response.text());
  } catch {
    return null;
  }
}

/**
 * The CSRF token for this session, from the cheapest source that has one.
 *
 * `refresh` drops the cached value first — for the retry after a 403, where
 * the cached token has evidently expired.
 *
 * @returns the token, or `null` when no source carries one; the submit then
 * goes out without the header and the server's answer tells the story.
 */
export async function resolveCsrfToken(
  formId: string,
  options?: { refresh?: boolean },
): Promise<string | null> {
  if (options?.refresh === true) cached = null;
  if (cached !== null) return cached;

  cached = fromMeta() ?? fromGlobals() ?? (await fromPluginPage(formId));
  return cached;
}
