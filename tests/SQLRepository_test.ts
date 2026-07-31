import { SQLRepository } from "../lib/SQLRepository.ts";
import { ClassFactoryStub } from "./stubs/ClassFactoryStub.ts";

Deno.test("SQLRepository", async (t) => {
  await t.step("constructor", () => {
    const repo = new SQLRepository(ClassFactoryStub, {});
  });
});
