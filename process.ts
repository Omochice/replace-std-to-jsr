import { collectDirectDependencies } from "./collect.ts";
import { replaceStdToJsr } from "./regexp.ts";

/**
 * Process the given file
 *
 * @param filename The filename
 * @returns The replaced file content
 */
export async function process(filename: URL): Promise<string> {
  const deps = collectDirectDependencies(filename.pathname);
  for (const dep of deps) {
    await replaceStdToJsr(dep);
  }

  return deps.at(0)?.statement.getSourceFile().getFullText() ??
    Deno.readTextFileSync(filename);
}
