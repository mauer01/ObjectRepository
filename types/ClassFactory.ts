import type { Arguments } from "./Arguments.ts";
import type { SaveAble } from "./SaveAble.ts";

export type ClassFactory<
  Args extends Arguments,
  Dependencies extends Record<string, unknown>,
  UnreservedObject extends SaveAble<Args>,
> = {
  name: string;
  load<
    A extends Args,
    B extends Dependencies,
  >(
    args: A,
    dependencies: B,
  ): UnreservedObject;
  structuredType: Args;
};
