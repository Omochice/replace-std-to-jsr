import { ensure } from "jsr:@core/unknownutil@3.18.0";
import { isMetadata } from "./type.ts";

/**
 * Fetch the metadata of a module from jsr.io
 *
 * @param module The module name
 * @param version The version
 * @returns The metadata
 */
export async function fetchMetaData(
  module: string,
  version: string,
): Promise<Record<string, string>> {
  const url = `https://jsr.io/@std/${module}/${version}_meta.json`;
  const res = await fetch(url);
  return ensure(await res.json(), isMetadata).exports;
}

/**
 * Create a lookup table from the metadata
 *
 * @param meta The metadata
 * @returns Created lookup table
 */
export function createLookUpTable(
  meta: Record<string, string>,
): Map<string, string> {
  return new Map<string, string>(
    Object.entries(meta).map((e) => e.reverse() as [string, string]),
  );
}
