import type { ObjectRepository } from "../types/ObjectRepository.ts";
import type { SaveAble } from "../types/SaveAble.ts";
import type { Arguments } from "../types/Arguments.ts";
import type { Identified } from "../types/Identified.ts";
import type { ClassFactory } from "../types/ClassFactory.ts";
import type { Logger } from "Logger";

export class SQLRepository<
  Object extends SaveAble<Args>,
  Args extends Arguments,
  Dependencies extends Record<string, unknown>,
> implements ObjectRepository<Object> {
  logger: Logger | typeof console;
  constructor(
    private readonly ObjectClass: ClassFactory<Args, Dependencies, Object>,
    private readonly dependencies: Dependencies,
    private readonly baseTableName: string = this.ObjectClass.name,
    private readonly sqlConfig?: {},
    logger?: Logger,
  ) {
    this.logger = logger
      ? logger.withOwnContext(`SQLRepository ${this.baseTableName}`)
      : console;
    this.logger.log("Initiating...");
  }
  find(_key: string): Identified<Object> {
    throw new Error("Method not implemented.");
  }
  save(_object: Identified<Object>): Identified<Object>;
  save(_object: Object): Identified<Object>;
  save(_object: unknown): Identified<Object> {
    throw new Error("Method not implemented.");
  }

  saveMany(..._objects: (Identified<Object> | Object)[]): Identified<Object>[] {
    throw new Error("Method not implemented.");
  }
  findAll(): Identified<Object>[] {
    throw new Error("Method not implemented.");
  }
  delete(_object: Identified<Object>): void {
    throw new Error("Method not implemented.");
  }
  deleteMany(..._object: Identified<Object>[]): void {
    throw new Error("Method not implemented.");
  }
}
