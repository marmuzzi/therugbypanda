export function currentPackagePrefix(packageDate: string) {
  return `current-${packageDate}-`;
}

export function isCurrentPackageEditorialInputId(editorialInputId: unknown, packageDate: string) {
  return typeof editorialInputId === "string" && editorialInputId.startsWith(currentPackagePrefix(packageDate));
}
