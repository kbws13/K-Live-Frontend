export type Category = {
    id: number,
    code: string,
    name: string,
    parentCategoryId: number,
    icon: string,
    background: string,
    sort: number,
    children: Category[],
}