export type CategoryQueryRequest = {
    code: string,
    name: string,
    parentCategoryId: number,
    sort: number,
    coverLine2Tree: boolean
}