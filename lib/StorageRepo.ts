import type { ObjectRepository } from "../types/ObjectRepository.ts";
import type { Identified } from "../types/Identified.ts";
import type { Logger } from "Logger";
import type { SaveAble } from "../types/SaveAble.ts";
import type { Arguments } from "../types/Arguments.ts";
import type { ClassFactory } from "../types/ClassFactory.ts";

/**
 * Implementation of ObjectRepository that uses a storage mechanism (like LocalStorage).
 */
export class StorageRepo<
  Object extends SaveAble<Args>,
  Args extends Arguments,
  Dependencies extends Record<string, unknown>,
> implements ObjectRepository<Object> {
  /**
   * Finds an object by its key.
   * @param key The key to find.
   * @returns The identified object.
   * @throws Error if key is "_keys"
   */
  find(key: string): Identified<Object> {
    this.protectKeyListEntry(key);
    const args: string | null = this.repo.getItem(
      this.entryName(key),
    );
    this.assertNotNull(args, key);
    const parsed: Args = JSON.parse(args);
    const object: Object = this.Factory.load(parsed, this.dependencies);
    object.setId(key);
    return object;
  }

  /**
   * Saves an object.
   *
   * If the object is identified, it will override with its existing id.
   *
   * If the object is not identified, it will be assigned a new id and saved.
   * @param object The object to save.
   * @returns The identified object.
   * @throws Error if an identified object id is "_keys"
   */
  save(object: Identified<Object>): Identified<Object>;
  save(object: Object): Identified<Object>;
  save(object: Identified<Object> | Object): Identified<Object> {
    let key: string;
    if (object.isIdentified()) {
      key = object.id;
      this.protectKeyListEntry(key);
    } else {
      key = String(Number(this.keyList.toReversed()[0] ?? 0) + 1);
      this.keyList.push(key);
      object.setId(key);
    }
    this.syncKeyList();
    this.repo.setItem(this.entryName(key), JSON.stringify(object.save()));
    return object;
  }
  /**
   * Saves multiple objects.
   * @param objects The objects to save.
   * @returns An array of identified objects.
   * @throws Error if an identified object id is "_keys"
   */
  saveMany(...objects: (Object | Identified<Object>)[]): Identified<Object>[] {
    return objects.map((args) => this.save(args));
  }
  /**
   * Finds all objects in the repository.
   * @returns An array of identified objects.
   */
  findAll(): Identified<Object>[] {
    this.syncKeyList(true);
    return this.keyList.length > 0
      ? this.keyList.map((key) => this.find(key))
      : [];
  }
  /**
   * Deletes an object.
   * @param object The object to delete.
   * @throws Error if an identified object id is "_keys"
   */
  delete(object: Identified<Object>): void {
    const key = object.id;
    this.protectKeyListEntry(key);
    this.assertNotNull(this.repo.getItem(this.entryName(key)), key);
    this.repo.removeItem(this.entryName(key));
    this.keyList = this.keyList.filter((k) => k !== key);
    this.syncKeyList();
  }
  /**
   * Deletes multiple objects.
   * @param object The objects to delete.
   * @throws Error if an identified object id is "_keys"
   */
  deleteMany(...object: Identified<Object>[]) {
    object.forEach((obj) => this.delete(obj));
  }
  /**
   * Creates a new StorageRepo instance.
   * @param repo The storage mechanism to use.
   * @param tableName The name of the table in storage.
   * @param Factory The class of the objects being stored, with a static load method.
   * @param dependencies Dependencies required for loading objects.
   * @param logger Optional logger.
   */
  constructor(
    private readonly repo: Storage,
    private readonly tableName: string,
    private readonly Factory: ClassFactory<Args, Dependencies, Object>,
    private readonly dependencies: Dependencies,
    logger?: Logger,
  ) {
    this.logger = logger ? logger.withOwnContext("LocalStorageRepo") : console;
    this.logger.log("init: ", this.tableName);
    this.keysEntry = this.entryName("_keys");
    const localStorageKeys = this.repo.getItem(this.keysEntry);
    if (!localStorageKeys) {
      this.syncKeyList();
    } else {
      this.syncKeyList(true);
    }
  }

  /**
   * Asserts that a value is not null.
   * @param args The value to check.
   * @param key The key associated with the value.
   * @throws Error if the value is null or undefined.
   */
  private assertNotNull<T>(
    args: T,
    key: string,
  ): asserts args is Exclude<T | null, null> {
    if (!args) throw new Error(`${key} not found`);
  }

  /**
   * Protects the reserved "_keys" entry.
   * @param key The key to check.
   * @throws Error if the key is "_keys".
   */
  private protectKeyListEntry(key: string) {
    if (key === "_keys") throw new Error("_keys is protected");
  }

  /**
   * Synchronizes the key list with storage.
   * @param load If true, loads the key list from storage. If false, saves it to storage.
   */
  private syncKeyList(load?: boolean) {
    if (load) {
      this.keyList = JSON.parse(this.repo.getItem(this.keysEntry) ?? "[]");
    } else {
      this.repo.setItem(this.keysEntry, JSON.stringify(this.keyList));
    }
  }

  /**
   * List of all keys in the repository.
   */
  private keyList: string[] = [];
  /**
   * Logger instance.
   */
  private readonly logger: Logger | Console;
  /**
   * Generates the storage entry name for a given key.
   * @param key The key.
   * @returns The storage entry name.
   */
  private entryName(key: string): string {
    return `${this.tableName}:${key}`;
  }
  /**
   * The storage key for the list of all keys.
   */
  private readonly keysEntry: string;
}

/**
 * Example function.
 */
export function a() {
  return "asl";
}
