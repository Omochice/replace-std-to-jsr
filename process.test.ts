import { assertEquals } from "jsr:@std/assert@1.0.13";
import { toFileUrl } from "jsr:@std/path@1.1.1";
import dedent from "npm:dedent@1.6.0";
import { process } from "./process.ts";

Deno.test("test for process.ts", async (t) => {
  await t.step("If include https://deno.land/std, replace it.", async () => {
    const dummyFile = Deno.makeTempFileSync();
    const fileContent =
      `import * as Path from "https://deno.land/std@1.1.1/path/mod.ts";`;
    Deno.writeTextFileSync(dummyFile, fileContent);
    const expected = `import * as Path from "jsr:@std/path@1.1.1";`;
    assertEquals(await process(toFileUrl(dummyFile)), expected);
  });

  await t.step("If file has not deno.land/std, keep it.", async () => {
    const dummyFile = Deno.makeTempFileSync();
    const fileContent = `import * as Path from "jsr:@std/path@1.1.1";`;
    Deno.writeTextFileSync(dummyFile, fileContent);
    assertEquals(await process(toFileUrl(dummyFile)), fileContent);
  });

  await t.step("If include comment as file header, keep it.", async () => {
    const dummyFile = Deno.makeTempFileSync();
    const fileContent = dedent`
      // hogehoge
      import * as Path from "https://deno.land/std@1.1.1/path/mod.ts";
    `.trim();
    Deno.writeTextFileSync(dummyFile, fileContent);

    const expected = dedent`
      // hogehoge
      import * as Path from "jsr:@std/path@1.1.1";
    `.trim();

    assertEquals(await process(toFileUrl(dummyFile)), expected);
  });
});
