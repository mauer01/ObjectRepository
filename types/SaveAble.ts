import type { Identified } from "./Identified.ts";
import type { Arguments } from "./Arguments.ts";

export type SaveAble<T extends Arguments> = {
  save(): T;
  setId(id: string): asserts this is Identified<SaveAble<T>>;
  isIdentified(): this is Identified<SaveAble<T>>;
};
