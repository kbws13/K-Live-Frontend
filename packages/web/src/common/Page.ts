export type Page<T> = {
    records: T[],
    total: number,
    size: number,
    current: number,
    searchCount: boolean,
}