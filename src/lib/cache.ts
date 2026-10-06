const entries = new Map<string, { value: unknown; expires: number }>();

export async function cached<T>(key: string, ttlSeconds: number, load: () => Promise<T>): Promise<T> {
    const hit = entries.get(key);
    if (hit && hit.expires > Date.now()) return hit.value as T;
    const value = await load();
    entries.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
    return value;
}
