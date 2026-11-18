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
 * Die Liste der Formulare im Fenster „Formular wählen“. Geladen wird sie mit
 * `useEntityCatalog`: `fetchEntityCatalog` wirft nie – ein Fehler kommt als
 * leere Liste an, und eine leere Liste sagt die Seitenleiste als „keine
 * gefunden oder nicht geladen“ an und bietet „Erneut versuchen“ und die
 * Eingabe von Hand.
 */

import { EntityOption, fetchEntityCatalog } from "@shared/entity-picker/entity-catalog";
import type { EntityCatalog } from "@shared/entity-picker/use-entity-catalog";

import { formCatalogSource } from "./form-catalog";

export type FormCatalogLoader = () => Promise<EntityOption[]>;

export type FormCatalog = EntityCatalog<EntityOption>;

/** Was das Widget wirklich lädt: die Formulare mit Verwaltungsrechten. */
export const loadFormCatalog: FormCatalogLoader = () => fetchEntityCatalog(formCatalogSource);
