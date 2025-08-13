import { createLookUpTable, fetchMetaData } from "./metadata.ts";
import { join } from "jsr:@std/path@1.1.2";
import { Dependency } from "./type.ts";

const cache = new Map<string, Record<string, string>>();

const re =
  /https:\/\/deno\.land\/std@(?<version>\d+\.\d+\.\d+)\/(?<moduleName>[^\/]+)\/(?<path>[^"']+)/;

export async function replaceStdToJsr(
  dependency: Dependency,
): Promise<void> {
  const module = getModule(dependency.specifier);
  if (module == null) {
    return;
  }
  const newSpecifier = `"${await createReplaceString(module)}"`;
  dependency.statement.replaceWithText(newSpecifier);
}

function getModule(specifier: string): CreateReplaceStringOptions | undefined {
  const matched = specifier.match(re);
  if (matched == null) {
    return;
  }
  const { path, moduleName, version } = matched.groups ?? {};
  if (path == null || moduleName == null || version == null) {
    return;
  }
  return {
    moduleName,
    version,
    path: `./${path}`,
  };
}

type CreateReplaceStringOptions = {
  moduleName: string;
  version: string;
  path: string;
};

async function createReplaceString(
  opt: CreateReplaceStringOptions,
): Promise<string> {
  const { moduleName, version, path } = opt;
  const jsrModule = `jsr:@std/${moduleName}@${version}`;
  const meta = cache.get(jsrModule) ??
    (await fetchMetaData(moduleName, version));
  cache.set(jsrModule, meta);
  const lup = createLookUpTable(meta);
  const exportTo = lup.get(path);
  if (exportTo == null) {
    throw new Error(`Not found ${path} in ${jsrModule}`);
  }

  return join(jsrModule, exportTo);
}
