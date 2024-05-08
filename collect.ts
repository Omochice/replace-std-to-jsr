import { createGraph } from "jsr:@deno/graph@0.74.0";
import { ensure, is } from "jsr:@core/unknownutil@3.18.0";
import { type Dependency, isModuleGraph } from "./type.ts";

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
export async function collectDirectDependencies(
  filename: string,
): Promise<Dependency[]> {
  const graph = ensure(await createGraph(filename), isModuleGraph);
  const root = ensure(graph.roots[0], is.String);
  const deps = graph.modules.filter((mod) => mod.specifier === root);
  return deps
    .map((dep) => dep.dependencies ?? [])
    .flat()
    .map((dep) => {
      return [dep.code ?? [], dep.types ?? []]
        .flat()
        .map((d) => {
          return {
            specifier: dep.specifier,
            start: d.span.start,
            end: d.span.end,
          };
        });
    })
    .flat();
}
