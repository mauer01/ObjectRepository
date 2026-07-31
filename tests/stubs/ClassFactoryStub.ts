import type { SaveAble } from "../../types/SaveAble.ts";
import { ObjectStub } from "./ObjectStub.ts";
import type { ClassFactory } from "../../types/ClassFactory.ts";

export class ClassFactoryStub {
  static obj: ObjectStub = new ObjectStub();
  static load(): SaveAble<{ a: string }> {
    return this.obj.this;
  }
  static structuredType: { a: string };
}
type TestType = ClassFactory<{ a: string }, {}, SaveAble<{ a: string }>>;
type TypeError = typeof ClassFactoryStub extends TestType ? {} : never;
const _typeTest: TypeError = {};
