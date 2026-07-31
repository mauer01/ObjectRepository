import type { ObjectRepository } from "../types/ObjectRepository.ts";
import type { SaveAble } from "../types/SaveAble.ts";
import type { Arguments } from "../types/Arguments.ts";
import type { Identified } from "../types/Identified.ts";
import type { ClassFactory } from "../types/ClassFactory.ts";
import type { Logger } from "Logger";

export class RamRepo<
  Object extends SaveAble<Args>,
  Args extends Arguments,
  Dependencies extends Record<string, unknown>,
> implements ObjectRepository<Object> {
  logger: Logger | Console;
  constructor(
    private readonly Factory: ClassFactory<Args, Dependencies, Object>,
    private readonly dependencies: Dependencies,
    private readonly table: Record<string, Args>,
    private readonly name: string,
    logger?: Logger,
  ) {
    this.logger = logger
      ? logger.withOwnContext("RamRepo:" + this.name)
      : console;
    this.logger.log("RamRepo initiated for " + this.name);
  }
  find(key: string): Identified<Object> {
    if (!this.table[key]) throw new Error("Key not found in " + this.name);
    const object: Object = this.Factory.load(
      this.table[key],
      this.dependencies,
    );
    object.setId(key);
    return object;
  }
  findAllBy<T extends keyof Args>(
    arg: T,
    value: Args[T],
  ): Identified<Object>[] {
    return Object.keys(this.table).filter((key) => {
      return this.table[key][arg] === value;
    }).map((key) => this.find(key));
  }
  save(object: Identified<Object>): Identified<Object>;
  save(object: Object): Identified<Object>;
  save(object: Object | Identified<Object>): Identified<Object> {
    if (object.isIdentified()) {
      this.table[object.id] = object.save();
      return object;
    } else {
      object.setId(this.generateUniqueId());
      this.table[object.id] = object.save();
      return object;
    }
  }

  private generateUniqueId() {
    let id = Object.keys(this.table).length;
    while (this.table[id.toString()]) {
      id++;
    }
    return id.toString();
  }

  saveMany(
    ..._objects: (Object | Identified<Object>)[]
  ): Identified<Object>[] {
    return _objects.map((object) => this.save(object));
  }
  findAll(): Identified<Object>[] {
    return Object.keys(this.table).map((key) => this.find(key));
  }
  delete(object: Identified<Object>): void {
    delete this.table[object.id];
  }
  deleteMany(...object: Identified<Object>[]): void {
    object.forEach((object) => this.delete(object));
  }
}
