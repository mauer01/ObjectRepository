import { SaveAbleStub } from "../../../DuelingBookAddons/test/stubs/SaveAbleStub.ts";
import type { SaveAble } from "../../types/SaveAble.ts";

export class TestFactory {
  static args: unknown[] = [];
  static load(
    args: { arg1: string; arg2: string },
    deps: { no: string },
  ): SaveAble<{ arg1: string; arg2: string }> {
    this.args.push([args, deps]);
    const a = new SaveAbleStub();
    a.registerOutput("save", args, true);
    return a.this;
  }
  static clear(): void {
    this.args = [];
  }
  static structuredType: { arg1: string; arg2: string };
}
