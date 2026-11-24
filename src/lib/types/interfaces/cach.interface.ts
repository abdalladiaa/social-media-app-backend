export interface ICacheProvider{
    set(key: string, value: unknown, ttl?: number): Promise<"OK" | null>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<number>;
    ttl(key: string): Promise<number>;
    exists(key: string): Promise<number>;
}