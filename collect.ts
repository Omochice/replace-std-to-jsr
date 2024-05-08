import {
  type ExportDeclaration,
  type ImportDeclaration,
  Node,
  Project,
} from "npm:ts-morph@22.0.0";

/**
 * Collect the direct dependencies of a module
 *
 * @param filename The filename of the module
 * @returns Collection of direct dependencies
 * @exsample
 * ````ts
 * import { collectDirectDependencies } from "./collect.ts";
 * const fileaname = "mod.ts";
 * // mod.ts's contents:
 * // ```ts
 * // import { assert } from "jsr:@std@0.224.0/assert";
 * // import { bar } from "./bar.ts";
 * // ```
 *
 * const deps = await collectDirectDependencies("mod.ts");
 * // [
 * //   {
 * //     specifier: "jsr:@std@0.224.0/assert",
 * //     code: {
 * //       specifier: "jsr:@std@0.224.0/assert",
 * //       span: {
 * //         start: { line: 0, character: 23 },
 * //         end: { line: 0, character: 49 }
 * //       }
 * //     }
 * //   },
 * //   {
 * //     specifier: "./bar.ts",
 * //     code: {
 * //       specifier: "file:///path/to/bar.ts",
 * //       span: {
 * //         start: { line: 1, character: 20 },
 * //         end: { line: 1, character: 30 }
 * //       }
 * //     }
 * //   }
 * // ]
 * ````
 */
export function collectDirectDependencies(
  filename: string,
): Array<ImportDeclaration | ExportDeclaration> {
  const project = new Project();
  const file = project.addSourceFileAtPath(filename);

  return file.getStatements()
    .filter((s): s is ImportDeclaration | ExportDeclaration =>
      Node.isImportDeclaration(s) || Node.isExportDeclaration(s)
    );
}
