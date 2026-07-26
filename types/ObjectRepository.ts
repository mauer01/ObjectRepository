import type { Identified } from "./Identified.ts";
import type { SaveAble } from "./SaveAble.ts";
import type { Arguments } from "./Arguments.ts";

export type ObjectRepository<Object extends SaveAble<Arguments>> = {
  find(_key: string): Identified<Object>;
  save(_object: Identified<Object>): Identified<Object>;
  save(_object: Object): Identified<Object>;
  saveMany(..._objects: Identified<Object>[]): Identified<Object>[];
  saveMany(..._objects: Object[]): Identified<Object>[];
  findAll(): Identified<Object>[];
  delete(_object: Identified<Object>): void;
  deleteMany(..._object: Identified<Object>[]): void;
};
