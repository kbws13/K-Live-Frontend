export type CategoryUpdateRequest = {
    id: number,
    code: string,
    name: string,
    parentCategoryId: number,
    icon: string,
    background: string,
    sort: number
}