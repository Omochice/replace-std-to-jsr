import { Command } from "jsr:@cliffy/command@1.0.0-rc.4";
import { createGraph } from "jsr:@deno/graph";
import { ensure, is } from "jsr:@core/unknownutil@3.18.0";

import { join, resolve, toFileUrl } from "jsr:@std/path@0.224.0";

const re =
  /https:\/\/deno\.land\/std@(?<version>\d+\.\d+\.\d+)\/(?<moduleName>[^\/]+)/;

if (import.meta.main) {
  const { args, options } = await new Command()
    .name("replace-std-to-jsr")
    .arguments("<...in:string>")
    .option("--dry-run", "dry run mode", { default: false })
    .option("--debug", "debug mode", { default: false })
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

async function process(filename: URL): Promise<string> {
  const contents = await Deno.readTextFileSync(filename).split(/\r?\n/);
  const deps = await getDirectDepnames(filename.href);
  const grouped = Object.groupBy(deps, (dep) => {
    const matched = dep.specifier.match(re);
    if (matched === null) {
      return "unknown";
    }
    return `${matched.groups?.moduleName}@${matched.groups?.version}`;
  });
  delete grouped.unknown;
  for (const [moduleName, files] of Object.entries(grouped)) {
    const [module, version] = moduleName.split("@");
    const meta = await fetchMetaData(module, version);
    const map = gya(meta);
    for (const file of files ?? []) {
      const path = "./" + file.specifier.split("/").at(-1);
      const r = map.get(path);
      if (r === undefined) {
        console.error(`Not found ${path}`);
        continue;
      }
      const newPath = join(`jsr:@std/${module}@${version}`, r);
      const line = contents[file.code.span.start.line];
      const pre = line.slice(0, file.code.span.start.character);
      const post = line.slice(file.code.span.end.character);
      const newLine = `${pre}"${newPath}"${post}`;
      contents[file.code.span.start.line] = newLine;
    }
  }
  return contents.join("\n");
}

async function getDirectDepnames(
  filename: string,
): Promise<Record<string, unknown>[]> {
  const graph = await createGraph(filename);
  const root = ensure(graph.roots[0], is.String);
  const deps = graph.modules.filter((mod) => mod.specifier === root);
  return deps.map((dep) => dep.dependencies).flat();
}

async function fetchMetaData(module: string, version: string) {
  const url = `https://jsr.io/@std/${module}/${version}_meta.json`;
  const res = await fetch(url);
  return (await res.json()).exports as Record<string, string>;
}

function gya(meta: Record<string, string>): Map<string, string> {
  const d = Object.entries(meta).map((e) => e.reverse() as [string, string]);
  return new Map<string, string>(d);
}
