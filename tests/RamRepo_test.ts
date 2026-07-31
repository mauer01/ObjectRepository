import { RamRepo } from "../lib/RamRepo.ts";
import { assertEquals, assertThrows } from "@std/assert";
import { SaveAbleStub } from "../../DuelingBookAddons/test/stubs/SaveAbleStub.ts";
import type { SaveAble } from "../../DuelingBookAddons/Interfaces/SaveAble.ts";
import { RamLogger } from "Logger";
import type { Identified } from "../../DuelingBookAddons/Interfaces/Identified.ts";
import { TestFactory } from "./stubs/TestFactory.ts";

Deno.test("RamRepo", async (t) => {
  const table: Record<string, any> = {};
  const clearTable = () => {
    for (const key in table) delete table[key];
  };
  const ramLogger = new RamLogger("RamRepo_Test");
  const testDeps = { no: "hallo" };
  const testArgs = { arg1: "arg1", arg2: "arg2" };
  clearTable();
  const ramRepo = new RamRepo(
    TestFactory,
    testDeps,
    table,
    "test",
    ramLogger,
  );
  await t.step("loadup", async (st) => {
    await st.step("no keys", () => {
      assertEquals(Object.keys(table).length, 0);
    });
    await st.step("keys", () => {
      table["1"] = testArgs;
      table["2"] = testArgs;
      assertEquals(
        new RamRepo(TestFactory, testDeps, table, "test", ramLogger)
          .findAll().length,
        2,
      );
      clearTable();
    });
  });
  await t.step("save", async (st) => {
    await st.step("success", () => {
      clearTable();

      const obj = ramRepo.save(TestFactory.load(testArgs, testDeps));
      assertEquals(
        table[obj.id],
        testArgs,
      );
    });
    await st.step("overwriting saves", () => {
      clearTable();
      const testArgs2: { arg1: string; arg2: string } = {
        arg1: "arg123",
        arg2: "arg123",
      };
      const obj = ramRepo.save(
        TestFactory.load(testArgs, testDeps),
      ) as unknown as Identified<SaveAbleStub>;
      obj.reset(true);
      assertEquals(
        table[obj.id],
        testArgs,
      );
      obj.registerOutput("save", testArgs2);
      const obj2 = ramRepo.save(obj.this);
      assertEquals(
        table[obj2.id],
        testArgs2,
      );
    });
  });
  await t.step("find", async (st) => {
    TestFactory.clear();
    clearTable();
    table["1"] = testArgs;
    await st.step("success", () => {
      const item = ramRepo.find("1");
      assertEquals(item.save(), testArgs);
      assertEquals(TestFactory.args, [[testArgs, testDeps]]);
    });
    await st.step("not found", () => {
      assertThrows(
        () => {
          ramRepo.find("2");
        },
        Error,
        "Key not found in test",
      );
      clearTable();
    });
  });
  await t.step("delete", async (st) => {
    await st.step("success", () => {
      table["1"] = testArgs;
      ramRepo.delete({ id: "1" } as unknown as Identified<
        SaveAble<{
          arg1: string;
          arg2: string;
        }>
      >);
      assertEquals(table["1"], undefined);
      clearTable();
    });
  });
  await t.step("saveMany", async (st) => {
    await st.step("success", () => {
      const a = new SaveAbleStub();
      const b = new SaveAbleStub();
      a.registerOutput("save", testArgs);
      b.registerOutput("save", testArgs);
      const [obj, obj2] = ramRepo.saveMany(a.this, b.this);
      assertEquals(
        table[obj.id],
        testArgs,
      );
      assertEquals(
        table[obj2.id],
        testArgs,
      );
      clearTable();
    });
  });
  await t.step("findAll", async (st) => {
    await st.step("success", () => {
      TestFactory.clear();
      table["1"] = testArgs;
      table["2"] = testArgs;
      const [item1, item2] = ramRepo.findAll();
      assertEquals(item1.save(), testArgs);
      assertEquals(item2.save(), testArgs);
      assertEquals(TestFactory.args, [[testArgs, testDeps], [
        testArgs,
        testDeps,
      ]]);
      clearTable();
    });
    await st.step("no table returns an empty list", () => {
      for (const key in table) delete table[key];
      const empty = ramRepo.findAll();
      assertEquals(empty, []);
      clearTable();
      TestFactory.clear();
    });
  });
});
