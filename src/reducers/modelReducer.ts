import IDocument from "../models/Document"
import { IAnnotationLabel } from "../pages/Model/DocumentViewer/AddAnnotationWindow/SetAnnotationLabel/SetAnnotationLabel"

export interface IAnnotation {
  idAnnotation: string
  idModel: string
  name: string
  type: number
  colorHexa: string
  confidence?: number
}

export enum ModelPageMode {
  "EMPTY" = "EMPTY",
  "ANNOTATION" = "ANNOTATION",
  "ONLINE" = "ONLINE"
}

export interface IModelReducerState {
  documents: IDocument[]
  activeFileIndex: number
  amountOfFiles: number
  annotationList: IAnnotation[]
  mode: ModelPageMode
  annotationLabels: IAnnotationLabel[]
  annotationTypes: number[]
  updateAnnotationsToggle: boolean
  amountOfAnnotationPerDocument: number[]
}

const initialState: IModelReducerState = {
  documents: [],
  activeFileIndex: 0,
  amountOfFiles: 0,
  annotationList: [],
  mode: ModelPageMode.EMPTY,
  annotationLabels: [],
  annotationTypes: [],
  updateAnnotationsToggle: true,
  amountOfAnnotationPerDocument: []
}

export const ModelReducer = (state = initialState, action: ActionsTypes): IModelReducerState => {
  switch (action.type) {
    case "[Model page] update mode":
      return { ...state, mode: action.payload }

    case "[Model page] add new file":
      return {
        ...state,
        documents: state.documents.concat([action.payload]),
        amountOfAnnotationPerDocument: state.amountOfAnnotationPerDocument.concat([0])
      }

    case "[Model page] remove file":
      const documentIndex: number = action.payload

      let updatedActiveFileIndex: number = state.activeFileIndex

      let updatedDocumentsArr: IDocument[] = [...state.documents]
      updatedDocumentsArr.splice(documentIndex, 1)

      let updatedAmountOfAnnotationPerDocumentArr: number[] = [...state.amountOfAnnotationPerDocument]
      updatedAmountOfAnnotationPerDocumentArr.splice(documentIndex, 1)

      if (state.activeFileIndex === state.documents.length - 1) {
        updatedActiveFileIndex = updatedActiveFileIndex - 1
      }

      return {
        ...state,
        documents: updatedDocumentsArr,
        amountOfAnnotationPerDocument: updatedAmountOfAnnotationPerDocumentArr,
        activeFileIndex: updatedActiveFileIndex,
        amountOfFiles: state.amountOfFiles - 1
      }

    case "[Model page] update active file index":
      return { ...state, activeFileIndex: action.payload }

    case "[Model page] increment amount of files":
      return { ...state, amountOfFiles: state.amountOfFiles + 1 }

    case "[Model page] decrement amount of files":
      return { ...state, amountOfFiles: state.amountOfFiles - 1 }

    case "[Model page] set annotation labels":
      return { ...state, annotationLabels: action.payload }

    case "[Model page] set annotation types":
      return { ...state, annotationTypes: action.payload }

    case "[Model page] add new annotation":
      var newAmountOfAnnotationPerDocumentArr = state.amountOfAnnotationPerDocument
      newAmountOfAnnotationPerDocumentArr[state.activeFileIndex] = newAmountOfAnnotationPerDocumentArr[state.activeFileIndex] + 1
      return {
        ...state,
        annotationList: state.annotationList.concat([action.payload]),
        amountOfAnnotationPerDocument: [...newAmountOfAnnotationPerDocumentArr]
      }

    case "[Model page] delete annotation":
      var newAmountOfAnnotationPerDocumentArr = state.amountOfAnnotationPerDocument
      newAmountOfAnnotationPerDocumentArr[state.activeFileIndex] = newAmountOfAnnotationPerDocumentArr[state.activeFileIndex] - 1

      const filteredAnnotationList: IAnnotation[] = state.annotationList.filter(annotation => (
        annotation.idAnnotation !== action.payload
      ))

      return {
        ...state,
        annotationList: filteredAnnotationList,
        amountOfAnnotationPerDocument: [...newAmountOfAnnotationPerDocumentArr]
      }

    case "[Model page] update annotations toggle":
      return { ...state, updateAnnotationsToggle: !state.updateAnnotationsToggle }

    case "[Model page] set documents":
      const documentsArr: IDocument[] = action.payload
      let updatedAmountOfAnnotationPerDocument: number[] = [...state.amountOfAnnotationPerDocument]

      for (let i = 0; i < documentsArr.length; i++) {
        updatedAmountOfAnnotationPerDocument.push(0)
      }

      return {
        ...state,
        documents: [...documentsArr],
        amountOfAnnotationPerDocument: updatedAmountOfAnnotationPerDocument
      }

    case "[Model page] set annotations":
      return { ...state, annotationList: [...action.payload] }

    default:
      return state
  }
}

interface IUpdateModeAction {
  type: "[Model page] update mode"
  payload: ModelPageMode
}

export const updateMode = (mode: ModelPageMode): IUpdateModeAction => ({
  type: "[Model page] update mode",
  payload: mode
})

interface IAddNewDocumentAction {
  type: "[Model page] add new file"
  payload: IDocument
}

export const addNewDocument = (document: IDocument): IAddNewDocumentAction => ({
  type: "[Model page] add new file",
  payload: document
})

interface IUpdateActiveFileIndexAction {
  type: "[Model page] update active file index"
  payload: number
}

export const updateActiveFileIndex = (index: number): IUpdateActiveFileIndexAction => ({
  type: "[Model page] update active file index",
  payload: index
})

interface IIncrementAmountOfFilesAction {
  type: "[Model page] increment amount of files"
}

export const incrementAmountOfFiles = (): IIncrementAmountOfFilesAction => ({
  type: "[Model page] increment amount of files"
})

interface IDecrementAmountOfFilesAction {
  type: "[Model page] decrement amount of files"
}

export const decrementAmountOfFiles = (): IDecrementAmountOfFilesAction => ({
  type: "[Model page] decrement amount of files"
})

interface ISetAnnotationLabelsAction {
  type: "[Model page] set annotation labels"
  payload: IAnnotationLabel[]
}

export const setAnnotationLabels = (annotationLabels: IAnnotationLabel[]): ISetAnnotationLabelsAction => ({
  type: "[Model page] set annotation labels",
  payload: annotationLabels
})

interface ISetAnnotationTypesAction {
  type: "[Model page] set annotation types"
  payload: number[]
}

export const setAnnotationTypes = (annotationLabels: number[]): ISetAnnotationTypesAction => ({
  type: "[Model page] set annotation types",
  payload: annotationLabels
})

interface IAddNewAnnotationAction {
  type: "[Model page] add new annotation"
  payload: IAnnotation
}

export const addNewAnnotation = (newAnnotation: IAnnotation): IAddNewAnnotationAction => ({
  type: "[Model page] add new annotation",
  payload: newAnnotation
})

interface IDeleteAnnotationAction {
  type: "[Model page] delete annotation"
  payload: string
}

export const deleteAnnotation = (annotationId: string): IDeleteAnnotationAction => ({
  type: "[Model page] delete annotation",
  payload: annotationId
})

interface IUpdateAnnotationsToggleAction {
  type: "[Model page] update annotations toggle"
}

export const updateAnnotationsToggle = (): IUpdateAnnotationsToggleAction => ({
  type: "[Model page] update annotations toggle"
})

interface ISetDocumentsAction {
  type: "[Model page] set documents",
  payload: IDocument[]
}

export const setDocuments = (documentsArr: IDocument[]): ISetDocumentsAction => ({
  type: "[Model page] set documents",
  payload: documentsArr
})

interface ISetAnnotationsAction {
  type: "[Model page] set annotations",
  payload: IAnnotation[]
}

export const setAnnotations = (annotationsArr: IAnnotation[]): ISetAnnotationsAction => ({
  type: "[Model page] set annotations",
  payload: annotationsArr
})

interface IRemoveFileAction {
  type: "[Model page] remove file",
  payload: number
}

export const removeFile = (fileIndex: number): IRemoveFileAction => ({
  type: "[Model page] remove file",
  payload: fileIndex
})

type ActionsTypes =
  ReturnType<typeof updateMode> |
  ReturnType<typeof addNewDocument> |
  ReturnType<typeof updateActiveFileIndex> |
  ReturnType<typeof incrementAmountOfFiles> |
  ReturnType<typeof decrementAmountOfFiles> |
  ReturnType<typeof setAnnotationLabels> |
  ReturnType<typeof setAnnotationTypes> |
  ReturnType<typeof addNewAnnotation> |
  ReturnType<typeof deleteAnnotation> |
  ReturnType<typeof updateAnnotationsToggle> |
  ReturnType<typeof setDocuments> |
  ReturnType<typeof setAnnotations> |
  ReturnType<typeof removeFile>
