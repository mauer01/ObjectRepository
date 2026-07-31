import { StorageRepo } from "../lib/StorageRepo.ts";
import { assertEquals, assertThrows } from "@std/assert";
import { SaveAbleStub } from "../../DuelingBookAddons/test/stubs/SaveAbleStub.ts";
import type { SaveAble } from "../../DuelingBookAddons/Interfaces/SaveAble.ts";
import { RamLogger } from "Logger";
import type { Identified } from "../../DuelingBookAddons/Interfaces/Identified.ts";
class Test {
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
Deno.test("StorageRepo", async (t) => {
  const generateNoise = (a: boolean = false) => {
    localStorage.clear();
    localStorage.setItem("djkf:134", "noise");
    localStorage.setItem("djasd:13fdg", "noise");
    localStorage.setItem("djka:1sd", "noise");
    localStorage.setItem("djkf:13a", "noise");
    localStorage.setItem("djkf13a", "noise");
    localStorage.setItem("djkf1das:3a", "noise");
    if (!a) localStorage.setItem("test:_keys", "[]");
  };
  const ramLogger = new RamLogger("LocalStorageRepo_Test");
  const testDeps = { no: "hallo" };
  const testArgs = { arg1: "arg1", arg2: "arg2" };
  generateNoise(true);
  const localStorageRepo = new StorageRepo(
    localStorage,
    "test",
    Test,
    testDeps,
    ramLogger,
  );
  await t.step("loadup", async (st) => {
    await st.step("no keys", () => {
      assertEquals(localStorage.getItem("test:_keys"), "[]");
    });
    await st.step("keys", () => {
      localStorage.setItem("test:_keys", JSON.stringify(["1", "2"]));
      assertEquals(
        new StorageRepo(localStorage, "test", Test, testDeps, ramLogger)
          //@ts-ignore private member
          .keyList,
        ["1", "2"],
      );
      generateNoise();
    });
  });
  await t.step("save", async (st) => {
    await st.step("success", () => {
      generateNoise();

      const obj = localStorageRepo.save(Test.load(testArgs, testDeps));
      assertEquals(
        JSON.parse(localStorage.getItem("test:" + obj.id) ?? "{}"),
        testArgs,
      );
      assertEquals(
        JSON.parse(localStorage.getItem("test:_keys") ?? "{}"),
        [obj.id],
      );
    });
    await st.step("overwriting saves", () => {
      generateNoise();
      const testArgs2: { arg: string; arg2: string } = {
        arg: "arg123",
        arg2: "arg123",
      };
      const obj = localStorageRepo.save(
        Test.load(testArgs, testDeps),
      ) as unknown as Identified<SaveAbleStub>;
      obj.reset(true);
      assertEquals(
        localStorage.getItem("test:" + obj.id),
        JSON.stringify(testArgs),
      );
      obj.registerOutput("save", testArgs2);
      const obj2 = localStorageRepo.save(obj.this);
      assertEquals(
        localStorage.getItem("test:" + obj2.id),
        JSON.stringify(testArgs2),
      );
    });
  });
  await t.step("find", async (st) => {
    Test.clear();
    generateNoise();
    localStorage.setItem("test:1", JSON.stringify(testArgs));
    await st.step("success", () => {
      const item = localStorageRepo.find("1");
      assertEquals(item.save(), testArgs);
      assertEquals(Test.args, [[testArgs, testDeps]]);
    });
    await st.step("not found", () => {
      assertThrows(
        () => {
          localStorageRepo.find("2");
        },
        Error,
        "2 not found",
      );
      generateNoise();
    });
    await st.step("key table error", () => {
      assertThrows(
        () => {
          localStorageRepo.find("_keys");
        },
        Error,
        "_keys is protected",
      );
    });
  });
  await t.step("delete", async (st) => {
    //@ts-ignore private
    localStorageRepo.keyList = [];
    await st.step("success", () => {
      localStorage.setItem("test:1", "a");
      localStorage.setItem("test:_keys", "['1']");
      localStorageRepo.delete({ id: "1" } as unknown as Identified<
        SaveAble<{
          arg1: string;
          arg2: string;
        }>
      >);
      assertEquals(localStorage.getItem("test:1"), null);
      assertEquals(localStorage.getItem("test:_keys"), "[]");
      generateNoise();
    });
    await st.step("failed to find", () => {
      assertThrows(
        () => {
          localStorageRepo.delete({ id: "2" } as unknown as Identified<
            SaveAble<{
              arg1: string;
              arg2: string;
            }>
          >);
        },
        Error,
        "2 not found",
      );
    });
    await st.step("key table error", () => {
      assertThrows(
        () => {
          localStorageRepo.delete({ id: "_keys" } as unknown as Identified<
            SaveAble<{
              arg1: string;
              arg2: string;
            }>
          >);
        },
        Error,
        "_keys is protected",
      );
    });
  });
  await t.step("saveMany", async (st) => {
    await st.step("success", () => {
      const a = new SaveAbleStub();
      const b = new SaveAbleStub();
      a.registerOutput("save", testArgs);
      b.registerOutput("save", testArgs);
      const [obj, obj2] = localStorageRepo.saveMany(a.this, b.this);
      assertEquals(
        localStorage.getItem("test:" + obj.id),
        JSON.stringify(testArgs),
      );
      assertEquals(
        localStorage.getItem("test:" + obj2.id),
        JSON.stringify(testArgs),
      );
      assertEquals(
        localStorage.getItem("test:_keys"),
        JSON.stringify([obj.id, obj2.id]),
      );
      generateNoise();
    });
  });
  await t.step("findAll", async (st) => {
    await st.step("success", () => {
      Test.clear();
      localStorage.setItem("test:1", JSON.stringify(testArgs));
      localStorage.setItem("test:2", JSON.stringify(testArgs));
      localStorage.setItem("test:_keys", JSON.stringify(["1", "2"]));
      const [item1, item2] = localStorageRepo.findAll();
      assertEquals(item1.save(), testArgs);
      assertEquals(item2.save(), testArgs);
      assertEquals(Test.args, [[testArgs, testDeps], [testArgs, testDeps]]);
      generateNoise();
    });
    await st.step("no table returns an empty list", () => {
      const empty = localStorageRepo.findAll();
      assertEquals(empty, []);
      generateNoise();
      Test.clear();
    });
  });
});
