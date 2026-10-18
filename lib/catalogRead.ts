/** Retry only read queries; never replay a write after an uncertain response. */
export async function readCatalogQuery<T extends { error: unknown; status?: number }>(
  query: (signal: AbortSignal) => PromiseLike<T>
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      const result = await query(AbortSignal.timeout(6000));
      const transient = result.status === 0 || result.status === 408 || result.status === 429 || (result.status !== undefined && result.status >= 500);
      if (!result.error || !transient || attempt === 1) return result;
    } catch (error) {
      const transient = error instanceof TypeError || (error instanceof Error && ["AbortError", "TimeoutError"].includes(error.name));
      if (!transient || attempt === 1) throw error;
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
}
