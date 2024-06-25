import {
  type ExportDeclaration,
  type ImportDeclaration,
  Node,
  Project,
} from "npm:ts-morph@23.0.0";
import { Dependency } from "./type.ts";

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
 * //     specifier: '"jsr:@std@0.224.0/assert"',
 * //     statement: <StringLiteral>,
 * //     code: {
 * //       specifier: "jsr:@std@0.224.0/assert",
 * //       span: {
 * //         start: { line: 0, character: 23 },
 * //         end: { line: 0, character: 48 }
 * //       }
 * //     }
 * //   },
 * //   {
 * //     specifier: '"./bar.ts"',
 * //     statement: <StringLiteral>,
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
): Dependency[] {
  const project = new Project();
  const file = project.addSourceFileAtPath(filename);

  return file.getStatements()
    .filter((s): s is ImportDeclaration | ExportDeclaration => {
      return Node.isImportDeclaration(s) || Node.isExportDeclaration(s);
    })
    .map((s) => {
      const specifier = s.getModuleSpecifier();
      if (specifier == null) {
        return;
      }
      const start = file.getLineAndColumnAtPos(specifier.getStart());
      const end = file.getLineAndColumnAtPos(specifier.getEnd());
      // NOTE: line and column are 1-based
      return {
        specifier: specifier.getText(),
        statement: specifier,
        start: {
          line: start.line - 1,
          character: start.column - 1,
        },
        end: {
          line: end.line - 1,
          character: end.column - 1,
        },
      };
    })
    .filter((s): s is Dependency => s != null);
}
