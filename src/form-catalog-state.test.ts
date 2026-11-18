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

import { act, renderHook } from "@testing-library/react";
import type { EntityOption } from "@shared/entity-picker/entity-catalog";

import { formsOf, useFormCatalog } from "./form-catalog-state";

const FORMS: EntityOption[] = [{ id: "aaaaaaaaaaaaaaaaaaaaaaaa", title: "Anmeldung" }];

/** Ein Versprechen, das der Test selbst einlöst. */
function deferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
  let resolve: (value: T) => void = () => undefined;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe("useFormCatalog", () => {
  it("lädt die Formulare und lädt auf Wunsch neu", async () => {
    const load = jest.fn().mockResolvedValue(FORMS);
    const { result } = renderHook(() => useFormCatalog(load));
    expect(result.current.state).toEqual({ status: "loading" });

    await act(async () => undefined);
    expect(formsOf(result.current.state)).toEqual(FORMS);

    await act(async () => result.current.reload());
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("zeigt nach einem Fehler eine leere Liste statt eines ewigen Ladens", async () => {
    const load = jest.fn().mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => useFormCatalog(load));

    await act(async () => undefined);
    expect(result.current.state).toEqual({ status: "ready", forms: [] });
  });

  it("verwirft das Ergebnis eines überholten Ladelaufs", async () => {
    const first = deferred<EntityOption[]>();
    const load = jest.fn().mockReturnValueOnce(first.promise).mockResolvedValueOnce([]);
    const { result } = renderHook(() => useFormCatalog(load));

    await act(async () => result.current.reload());
    await act(async () => first.resolve(FORMS));

    expect(result.current.state).toEqual({ status: "ready", forms: [] });
  });
});
