import { as, is } from "jsr:@core/unknownutil@4.3.0";
import type { StringLiteral } from "npm:ts-morph@26.0.0";

export type Dependency = {
  specifier: string;
  statement: StringLiteral;
  start: {
    line: number;
    character: number;
  };
  end: {
    line: number;
    character: number;
  };
};

/**
 * Determine whether the given value is a Range
 */
const isRange = is.ObjectOf({
  span: is.ObjectOf({
    start: is.ObjectOf({
      line: is.Number,
      character: is.Number,
    }),
    end: is.ObjectOf({
      line: is.Number,
      character: is.Number,
    }),
  }),
});

/**
 * Determine whether the given value is a Dependency
 */
export const isDependency = is.ObjectOf({
  specifier: is.String,
  code: as.Optional(isRange),
  types: as.Optional(isRange),
});

/**
 * Determine whether the given value is a DependencyGraph
 */
export const isDependencyGraph = is.UnionOf([
  is.ObjectOf({
    specifier: is.String,
    dependencies: as.Optional(is.ArrayOf(isDependency)),
  }),
  is.ObjectOf({
    specifier: is.String,
    error: is.String,
    dependencies: is.Undefined,
  }),
]);

/**
 * Determine whether the given value is a ModuleGraph
 */
export const isModuleGraph = is.ObjectOf({
  roots: is.ArrayOf(is.String),
  modules: is.ArrayOf(isDependencyGraph),
});

/**
 * Determine whether the given value is a Metadata
 */
export const isMetadata = is.ObjectOf({
  exports: is.RecordOf(is.String),
});
