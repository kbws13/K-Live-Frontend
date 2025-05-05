export type UserRegistryRequest = {
    nickName: string,
    email: string,
    password: string,
    checkPassword: string,
    checkCodeKey: string,
    checkCode: string
}