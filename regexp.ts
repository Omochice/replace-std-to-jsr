import {
  type ExportDeclaration,
  type ImportDeclaration,
} from "npm:ts-morph@22.0.0";
import { createLookUpTable, fetchMetaData } from "./metadata.ts";
import { join } from "jsr:@std/path@0.224.0";

const re =
  /https:\/\/deno\.land\/std@(?<version>\d+\.\d+\.\d+)\/(?<moduleName>[^\/]+)\/(?<path>[^"']+)/;

export async function replaceStdToJsr(
  declaration: ExportDeclaration | ImportDeclaration,
): Promise<void> {
  const specifier = declaration.getModuleSpecifier();
  if (specifier == null) {
    return;
  }
  const literal = specifier.getText();
  const module = getModule(literal);
  if (module == null) {
    return;
  }
  const newSpecifier = `"${await createReplaceString(module)}"`;
  specifier.replaceWithText(newSpecifier);
}

function getModule(specifier: string): CreateReplaceStringOptions | undefined {
  const matched = specifier.match(re);
  if (matched == null) {
    return;
  }
  const path = `./${matched.groups?.path}`;
  const mod = matched.groups?.moduleName;
  const version = matched.groups?.version;
  if (mod == null || version == null) {
    return;
  }
  return {
    mod,
    version,
    path,
  };
}

type CreateReplaceStringOptions = {
  mod: string;
  version: string;
  path: string;
};

async function createReplaceString(
  opt: CreateReplaceStringOptions,
): Promise<string> {
  const { mod, version, path } = opt;
  const jsrModule = `jsr:@std/${mod}@${version}`;
  const meta = await fetchMetaData(mod, version);
  const lup = createLookUpTable(meta);
  const exportTo = lup.get(path);
  if (exportTo == null) {
    throw new Error(`Not found ${path} in ${jsrModule}`);
  }

  return join(jsrModule, exportTo);
}
