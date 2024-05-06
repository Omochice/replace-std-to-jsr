import { Command } from "jsr:@cliffy/command@1.0.0-rc.4";
import { join, resolve, toFileUrl } from "jsr:@std/path@0.224.0";

import { collectDirectDependencies } from "./collect.ts";
import { createLookUpTable, fetchMetaData } from "./metadata.ts";
import { groupName } from "./regexp.ts";

if (import.meta.main) {
  const { args, options } = await new Command()
    .name("replace-std-to-jsr")
    .description("The tiny tool to replace `https://deno.land/std@x.y.z/some-module/` to `jsr:@std/some-module@x.y.z/`")
    .arguments("<...in:string>")
    .option("--dry-run", "dry run mode. Result show in stdout", {
      default: false,
    })
    .parse(Deno.args);

  for (const filename of args.map((a) => toFileUrl(resolve(a)))) {
    console.error(`Processing ${filename.pathname}...`);
    const content = await process(filename);
    if (options.dryRun) {
      console.log(content);
    } else {
      Deno.writeTextFileSync(filename, content);
    }
  }
}

/**
 * Process the given file
 *
 * @param filename The filename
 * @returns Processed content
 */
async function process(filename: URL): Promise<string> {
  const contents = Deno.readTextFileSync(filename).split(/\r?\n/);
  const deps = await collectDirectDependencies(filename.href);
  const grouped = Object.groupBy(deps, groupName);
  delete grouped.unknown; // FIXME: `delete` is little uglify...
  for (const [moduleName, files] of Object.entries(grouped)) {
    const [mod, version] = moduleName.split("@");
    const meta = await fetchMetaData(mod, version);
    const lup = createLookUpTable(meta);
    for (const file of files ?? []) {
      const path = `./${file.specifier.split("/").at(-1)}`;
      const jsrModule = `jsr:@std/${mod}@${version}`;
      const exportTo = lup.get(path);
      if (exportTo == null) {
        console.error(`Not found ${path} in ${jsrModule}`);
        continue;
      }
      for (const range of [file.code, file.types].filter((t) => t != null)) {
        // NOTE: ts 5.5 will fix this `possible null` issue
        const newPath = join(jsrModule, exportTo);
        if (range!.span.start.line !== range!.span.end.line) {
          console.error("Not support multi line replacement yet.");
          continue;
        }
        const line = contents[range!.span.start.line];
        const pre = line.slice(0, range!.span.start.character);
        const post = line.slice(range!.span.end.character);
        const newLine = `${pre}"${newPath}"${post}`;
        contents[range!.span.start.line] = newLine;
      }
    }
  }
  return contents.join("\n");
}
