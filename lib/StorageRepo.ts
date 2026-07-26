import type { ObjectRepository } from "../types/ObjectRepository.ts";
import type { Identified } from "../types/Identified.ts";
import type { Logger } from "Logger";
import type { SaveAble } from "../types/SaveAble.ts";
import type { Arguments } from "../types/Arguments.ts";

export class StorageRepo<
  Object extends SaveAble<Args>,
  Args extends Arguments,
  Dependencies extends Record<string, unknown>,
> implements ObjectRepository<Object> {
  find(key: string): Identified<Object> {
    this.protectKeyListEntry(key);
    const args: string | null = this.repo.getItem(
      this.entryName(key),
    );
    this.assertNotNull(args, key);
    const parsed: Args = JSON.parse(args);
    const object: Object = this.ObjectClass.load(parsed, this.dependencies);
    object.setId(key);
    return object;
  }

  private assertNotNull<T>(
    args: T,
    key: string,
  ): asserts args is Exclude<T | null, null> {
    if (!args) throw new Error(`${key} not found`);
  }

  private protectKeyListEntry(key: string) {
    if (key === "_keys") throw new Error("_keys is protected");
  }

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
  saveMany(...objects: Object[]): Identified<Object>[] {
    return objects.map((args) => this.save(args));
  }
  findAll(): Identified<Object>[] {
    this.syncKeyList(true);
    return this.keyList.length > 0
      ? this.keyList.map((key) => this.find(key))
      : [];
  }
  delete(object: Identified<Object>): void {
    const key = object.id;
    this.protectKeyListEntry(key);
    this.assertNotNull(this.repo.getItem(this.entryName(key)), key);
    this.repo.removeItem(this.entryName(key));
    this.keyList = this.keyList.filter((k) => k !== key);
    this.syncKeyList();
  }
  deleteMany(...object: Identified<Object>[]) {
    object.forEach((obj) => this.delete(obj));
  }
  constructor(
    private readonly repo: Storage,
    private readonly tableName: string,
    private readonly ObjectClass: {
      load<
        A extends Args,
        B extends Dependencies,
      >(
        args: A,
        dependencies: B,
      ): Object;
    },
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

  private syncKeyList(load?: boolean) {
    if (load) {
      this.keyList = JSON.parse(this.repo.getItem(this.keysEntry) ?? "[]");
    } else {
      this.repo.setItem(this.keysEntry, JSON.stringify(this.keyList));
    }
  }

  private keyList: string[] = [];
  private readonly logger: Logger | Console;
  private entryName(key: string): string {
    return `${this.tableName}:${key}`;
  }
  private readonly keysEntry: string;
}

export function a() {
  return "asl";
}
