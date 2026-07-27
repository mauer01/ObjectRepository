import type { Identified } from "./Identified.ts";
import type { Arguments } from "./Arguments.ts";

/**
 * Interface for objects that can be saved to and loaded from a repository.
 */
export type SaveAble<T extends Arguments> = {
  /**
   * potential id of the object
   */
  id?: string;
  /**
   * Returns all necessary information to save the object.
   */
  save(): T;
  /**
   * sets the id of the object and asserts id: string
   * @param id
   */
  setId(id: string): asserts this is Identified<SaveAble<T>>;
  /**
   * checks if the object has an id
   * @returns boolean and asserts id: string if true
   */
  isIdentified(): this is Identified<SaveAble<T>>;
};
