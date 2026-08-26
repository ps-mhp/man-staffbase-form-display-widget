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

/** The shape of a Staffbase backend id: 24 hex digits. */
const FORM_ID = /[0-9a-f]{24}/gi;

/**
 * The form's installation id out of whatever the author typed.
 *
 * A pasted form URL is accepted as well: it is the obvious thing to copy out
 * of the address bar, and the id is the last run of hex digits in it.
 */
export function readFormId(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const matches = raw.trim().match(FORM_ID);
  return matches === null ? null : matches[matches.length - 1].toLowerCase();
}
