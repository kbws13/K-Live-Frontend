const getLocalImage = (image: string) => {
    return new URL(`../assets/${image}`, import.meta.url).href;
}

export default{
    getLocalImage
}