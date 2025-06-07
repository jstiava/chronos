export {};
declare global {
    interface Map<K, V> {
        getOrCreate(key: K, createValue: () => V): V;
    }
}
