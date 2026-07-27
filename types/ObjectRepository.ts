import type { Identified } from "./Identified.ts";
import type { SaveAble } from "./SaveAble.ts";
import type { Arguments } from "./Arguments.ts";

/**
 * Generic interface for an object repository.
 */
export type ObjectRepository<Object extends SaveAble<Arguments>> = {
  /**
   * Finds an object by its unique identifier.
   * @param _key The unique identifier of the object.
   * @returns The identified object.
   */
  find(_key: string): Identified<Object>;

  /**
   * Saves an object to the repository.
   * @param _object The object to save.
   * @returns The identified object.
   */
  save(_object: Identified<Object>): Identified<Object>;
  save(_object: Object): Identified<Object>;

  /**
   * Saves multiple objects to the repository.
   * @param _objects The objects to save.
   * @returns An array of identified objects.
   */
  saveMany(..._objects: Identified<Object>[]): Identified<Object>[];
  saveMany(..._objects: Object[]): Identified<Object>[];

  /**
   * Retrieves all objects from the repository.
   * @returns An array of all identified objects.
   */
  findAll(): Identified<Object>[];

  /**
   * Deletes an object from the repository.
   * @param _object The object to delete.
   */
  delete(_object: Identified<Object>): void;

  /**
   * Deletes multiple objects from the repository.
   * @param _object The objects to delete.
   */
  deleteMany(..._object: Identified<Object>[]): void;
};
