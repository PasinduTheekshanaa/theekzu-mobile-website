/** Compare actual capacities, so 1TB follows 512GB. Non-capacity labels retain their order. */
export function compareStorage(a: string, b: string): number {
  const capacity = (label: string) => {
    const match = label.trim().match(/^(\d+(?:\.\d+)?)\s*(MB|GB|TB)$/i);
    if (!match) return null;
    return Number(match[1]) * ({ MB: 1 / 1024, GB: 1, TB: 1024 }[match[2].toUpperCase()] ?? 1);
  };
  const left = capacity(a);
  const right = capacity(b);
  if (left === null && right === null) return 0;
  if (left === null) return 1;
  if (right === null) return -1;
  return left - right;
}

export function sortStorages(storages: readonly string[]): string[] {
  return [...storages].sort(compareStorage);
}
