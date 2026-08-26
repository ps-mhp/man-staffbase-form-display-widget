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

import { EntityCatalogSource, EntityOption } from "@shared/entity-picker/entity-catalog";
import { pickLocalizedTitle } from "@shared/entity-picker/localized-title";

/** Where the app lists the form installations of the forms plugin. */
export const CATALOG_ENDPOINT = "/api/plugins/form/installations/search";

/**
 * How many forms the list offers at most.
 *
 * Newest first, so the cut-off hits what an author is least likely to be
 * looking for; anything beyond it is still reachable by typing the id.
 */
const CATALOG_LIMIT = 100;

interface RawFormEntry {
  data?: {
    id?: unknown;
    config?: { localization?: Record<string, { title?: unknown }> };
  };
}

interface CatalogResponse {
  entries?: RawFormEntry[];
}

/**
 * How the picker gets its form list.
 *
 * `fetchEntityCatalog(formCatalogSource)` is what the widget actually calls
 * (see `index.tsx`); this object only describes where from and how to map.
 */
export const formCatalogSource: EntityCatalogSource<RawFormEntry> = {
  async fetchList(): Promise<RawFormEntry[]> {
    const query = new URLSearchParams({
      // Anything less than `manage` would offer forms the author cannot
      // administer, which reads like a permission they do not have.
      permission: "manage",
      limit: String(CATALOG_LIMIT),
      sort: "updated_DESC",
    });

    const response = await fetch(`${CATALOG_ENDPOINT}?${query}`, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];

    const body = (await response.json()) as CatalogResponse;
    return body.entries ?? [];
  },

  toOption(entry: RawFormEntry): EntityOption | null {
    const id = entry?.data?.id;
    if (typeof id !== "string" || id === "") return null;
    return { id, title: pickLocalizedTitle(entry.data?.config?.localization) ?? id };
  },
};
