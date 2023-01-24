import { DocumentState } from "./DocumentState"
import IPage from "./Page"

export default interface IDocument {
    idDocument: string
    idModel: string
    name: string | null
    // TODO: FIX TYPE AFTER API FIX
    url: string | null | File
    ocrVersion: string | null
    pages: IPage[]
    state: DocumentState
    creationDate: string
    updateDate: string
}