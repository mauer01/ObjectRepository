import type { Identified } from "../types/Identified.ts";
import type { SaveAble } from "../types/SaveAble.ts";
import type { ObjectRepository } from "../types/ObjectRepository.ts";
import type { Serializable } from "../types/Serializable.ts";

class _A implements SaveAble<{ k: string }> {
  id?: string;
  save(): { k: string } {
    return { k: "" };
  }
  setId(id: string): asserts this is Identified<_A> {
    this.id = id;
  }
  isIdentified(): this is Identified<_A> {
    return typeof this.id === "string";
  }
}
const C: ObjectRepository<_A> = {} as ObjectRepository<_A>;
const B: Identified<_A> = C.find("a");

B.setId("123");
B.isIdentified();

const d: Serializable = ["1"];
JSON.stringify(d);
