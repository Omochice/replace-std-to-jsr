import type { Dependency } from "./type.ts";

const re =
  /https:\/\/deno\.land\/std@(?<version>\d+\.\d+\.\d+)\/(?<moduleName>[^\/]+)/;

export function groupName(dep: Dependency): "unknown" | `${string}@${string}` {
  const matched = dep.specifier.match(re);
  if (matched == null) {
    return "unknown";
  }
  return `${matched.groups?.moduleName}@${matched.groups?.version}`;
}
