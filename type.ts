import { is, type PredicateType } from "jsr:@core/unknownutil@3.18.0";

export type Dependency = PredicateType<typeof isDependency>;

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
  code: is.OptionalOf(isRange),
  types: is.OptionalOf(isRange),
});

/**
 * Determine whether the given value is a DependencyGraph
 */
export const isDependencyGraph = is.UnionOf([
  is.ObjectOf({
    specifier: is.String,
    dependencies: is.OptionalOf(is.ArrayOf(isDependency)),
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