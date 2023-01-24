import IDocument from "./Document"
import { ModelState } from "./ModelState"

export default interface IModel {
    idModel: string
    name: string | null
    documents: IDocument[]
    state: ModelState
    creationDate: string
    updateDate: string
}