import type { SaveAble } from "../types/SaveAble.ts";
import type { Arguments } from "../types/Arguments.ts";
import type { Identified } from "../types/Identified.ts";
import type { ClassFactory } from "../types/ClassFactory.ts";
import type { Logger } from "Logger";
import type { AsyncObjectRepository } from "../types/AsyncObjectRepository.ts";

export class SQLRepository<
  Object extends SaveAble<Args>,
  Args extends Arguments,
  Dependencies extends Record<string, unknown>,
> implements AsyncObjectRepository<Object> {
  logger: Logger | typeof console;
  constructor(
    private readonly Factory: ClassFactory<Args, Dependencies, Object>,
    private readonly dependencies: Dependencies,
    private readonly baseTableName: string = this.Factory.name,
    private readonly sqlConfig?: {},
    logger?: Logger,
  ) {
    this.logger = logger
      ? logger.withOwnContext(`SQLRepository ${this.baseTableName}`)
      : console;
    this.logger.log("Initiating...");
  }
  find(_key: string): Promise<Identified<Object>> {
    throw new Error("Method not implemented.");
  }
  save(object: Identified<Object>): Promise<Identified<Object>>;
  save(object: Object): Promise<Identified<Object>>;
  save(object: Identified<Object> | Object): Promise<Identified<Object>> {
    object.setId("");
    return new Promise((r) => {
      r(object);
    });
  }

  saveMany(
    ...objects: (Identified<Object> | Object)[]
  ): Promise<Identified<Object>[]> {
    return Promise.all(objects.map((e) => this.save(e)));
  }
  findAll(): Promise<Identified<Object>[]> {
    throw new Error("Method not implemented.");
  }
  delete(_object: Identified<Object>): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteMany(..._object: Identified<Object>[]): Promise<void[]> {
    throw new Error("Method not implemented.");
  }
}
