import { Command } from "jsr:@cliffy/command@1.0.0-rc.4";
import { resolve, toFileUrl } from "jsr:@std/path@0.224.0";

import { collectDirectDependencies } from "./collect.ts";
import { replaceStdToJsr } from "./regexp.ts";

if (import.meta.main) {
  const { args, options } = await new Command()
    .name("replace-std-to-jsr")
    .description(
      "The tiny tool to replace `https://deno.land/std@x.y.z/some-module/` to `jsr:@std/some-module@x.y.z/`",
    )
    .arguments("<...filenames:string>")
    .option("--dry-run", "dry run mode. Result show in stdout", {
      default: false,
    })
    .parse(Deno.args);

  for (const filename of args.map((a) => toFileUrl(resolve(a)))) {
    console.error(`Processing ${filename.pathname}...`);
    await process(filename, !options.dryRun);
  }
}

/**
 * Process the given file
 *
 * @param filename The filename
 * @returns Processed content
 */
async function process(filename: URL, overwrite: boolean): Promise<void> {
  const deps = collectDirectDependencies(filename.pathname);
  const files = deps.map((d) => d.getSourceFile());
  await Promise.all(deps.map((dep) => replaceStdToJsr(dep)));

  for (const file of files) {
    if (!file.isSaved() && overwrite) {
      await file.save();
    }
  }
}
