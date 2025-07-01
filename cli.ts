import { Command } from "jsr:@cliffy/command@1.0.0-rc.7";
import { resolve, toFileUrl } from "jsr:@std/path@1.1.1";
import { process } from "./process.ts";

const command = new Command()
  .name("replace-std-to-jsr")
  .description(
    "The tiny tool to replace `https://deno.land/std@x.y.z/some-module/` to `jsr:@std/some-module@x.y.z/`",
  )
  .arguments("<...filenames:string>")
  .option("--dry-run", "dry run mode. Result show in stdout", {
    default: false,
  })
  .action(async (options, ...args) => {
    for (const filename of args.map((a) => toFileUrl(resolve(a)))) {
      console.error(`Processing ${filename.pathname}...`);
      const replaced = await process(filename);
      if (options.dryRun) {
        console.log(replaced);
      } else {
        Deno.writeTextFileSync(filename, replaced);
      }
    }
  });

if (import.meta.main) {
  await command
    .parse(Deno.args);
}
