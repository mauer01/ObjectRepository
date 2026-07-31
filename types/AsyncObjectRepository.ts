import type { Identified } from "./Identified.ts";
import type { SaveAble } from "./SaveAble.ts";
import type { Arguments } from "./Arguments.ts";

/**
 * Generic interface for an object repository.
 */
export type AsyncObjectRepository<Object extends SaveAble<Arguments>> = {
  /**
   * Finds an object by its unique identifier.
   * @param _key The unique identifier of the object.
   * @returns The identified object.
   * @async
   */
  find(_key: string): Promise<Identified<Object>>;

  /**
   * Saves an object to the repository.
   * @param _object The object to save.
   * @returns The identified object.
   * @async
   */
  save(_object: Identified<Object>): Promise<Identified<Object>>;
  save(_object: Object): Promise<Identified<Object>>;

  /**
   * Saves multiple objects to the repository.
   * @param _objects The objects to save.
   * @returns An array of identified objects.
   * @async
   */
  saveMany(
    ..._objects: (Object | Identified<Object>)[]
  ): Promise<Identified<Object>[]>;

  /**
   * Retrieves all objects from the repository.
   * @returns An array of all identified objects.
   * @async
   */
  findAll(): Promise<Identified<Object>[]>;

  /**
   * Deletes an object from the repository.
   * @param _object The object to delete.
   * @async
   */
  delete(_object: Identified<Object>): Promise<void>;

  /**
   * Deletes multiple objects from the repository.
   * @param _object The objects to delete.
   * @async
   */
  deleteMany(..._object: Identified<Object>[]): Promise<void[]>;
};
