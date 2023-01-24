import IPoint from "./Point"

export default interface IWord {
    idWord: string
    idDocument: string
    idAnnotation: string
    content: string | null
    confidence: number
    polygon: IPoint[]
}