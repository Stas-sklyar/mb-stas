import IWord from "./Word"

export default interface IPage {
    pageNumber: number
    words: IWord[]
}