import { StubFullType } from "stub";
import type { SaveAble } from "../../types/SaveAble.ts";

export class ObjectStub extends StubFullType<SaveAble<{ a: string }>> {
  constructor() {
    super(["save", "setId", "isIdentified"]);
  }
}
