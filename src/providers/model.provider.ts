import axios, { AxiosResponse } from "axios"
import Config from "../config"
import IModel from "../models/Model"
import { IAnnotationLabel } from "../pages/Model/DocumentViewer/AddAnnotationWindow/SetAnnotationLabel/SetAnnotationLabel"
import { IAnnotation } from "../reducers/modelReducer"
import IAnntotationPostData from "../models/AnntotionPostData"
import IDocument from "../models/Document"

const ModelProvider = {
  getModelData: async (idModel: string): Promise<IModel> => {
    return new Promise(async (
      resolve: (value: IModel) => void,
      reject: (reason?: any) => void
    ) => {
      try {
        const response: AxiosResponse<any, any> = await axios.get(`${Config.API_URL}/Model/${idModel}`)
        resolve(response.data)
      } catch (err) {
        reject(err)
      }
    })
  },

  uploadPDFFile: async (idModel: string, pdfUrl: string): Promise<IDocument> => {
    return new Promise(async (
      resolve: (value: IDocument) => void,
      reject: (reason?: any) => void
    ) => {
      try {
        const response: AxiosResponse<any, any> = await axios.post(
          `${Config.API_URL}/Document/`,
          {
            idModel,
            url: pdfUrl
          }
        )
        resolve(response.data)
      } catch (err) {
        reject(err)
      }
    })
  },

  fetchAnnotationsList: (modelId: string): Promise<IAnnotation[]> => {
    return new Promise(async (
      resolve: (value: IAnnotation[]) => void,
      reject: (reason?: any) => void
    ) => {
      try {
        const response: AxiosResponse<any, any> = await axios.get(
          `${Config.API_URL}/Annotation/GetModel?idModel=${modelId}`
        )
        resolve(response.data)
      } catch (err) {
        reject(err)
      }
    })
  },

  getAnnotationLabels: (annotationList: IAnnotation[]): IAnnotationLabel[] => {
    const annotationLabelsArr: IAnnotationLabel[] = annotationList.map((annotation: IAnnotation) => ({
      id: annotation.idAnnotation,
      name: annotation.name,
      iconColor: annotation.colorHexa,
      annotationLabelType: annotation.type
    }))

    function removeEqualAnnotationLabels(arr: IAnnotationLabel[]): IAnnotationLabel[] {
      let resultArr: IAnnotationLabel[] = []

      for (let annotationLabel of arr) {
        const itemExistInArr: IAnnotationLabel | undefined = resultArr.find(item => (item.name === annotationLabel.name))

        if (!itemExistInArr) {
          resultArr.push(annotationLabel)
        }
      }

      return resultArr
    }

    return removeEqualAnnotationLabels(annotationLabelsArr)
  },

  createNewAnnotation: (newAnnotationData: IAnntotationPostData, wordsIdArr: string[]): Promise<IAnnotation> => {
    return new Promise(async (
      resolve: (value: IAnnotation) => void,
      reject: (reason?: any) => void
    ) => {
      try {
        const response: AxiosResponse<any, any> = await axios.post(
          `${Config.API_URL}/Annotation`,
          newAnnotationData
        )

        try {
          for (let i = 0; i < wordsIdArr.length; i++) {
            await axios.put(
              `${Config.API_URL}/Word/Annotation`,
              {
                idWord: wordsIdArr[i],
                idAnnotation: response.data.idAnnotation
              }
            )
          }
        } catch (err) {
          reject(err)
        } finally {
          resolve(response.data)
        }
      } catch (err) {
        reject(err)
      }
    })
  },

  connectExistingAnnotationWithWords: (annotationId: string, wordsIdArr: string[]): Promise<void> => {
    return new Promise(async (
      resolve: () => void,
      reject: (reason?: any) => void
    ) => {
      try {
        for (let i = 0; i < wordsIdArr.length; i++) {
          await axios.put(
            `${Config.API_URL}/Word/Annotation`,
            {
              idWord: wordsIdArr[i],
              idAnnotation: annotationId
            }
          )
        }
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },

  trainModel: (idModel: string): Promise<void> => {
    return new Promise(async (
      resolve: () => void,
      reject: (reason?: any) => void
    ) => {
      try {
        await axios.put(
          `${Config.API_URL}/Model/Train`,
          {
            idModel
          }
        )
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },

  createFromModel: async (idModel: string): Promise<string> => {
    return new Promise(async (
      resolve: (value: string) => void,
      reject: (reason?: any) => void
    ) => {
      try {
        const response: AxiosResponse<any, any> = await axios.post(
          `${Config.API_URL}/Model/CreateFromModel?idModel=${idModel}`
        )
        resolve(response.data)
      } catch (err) {
        reject(err)
      }
    })
  },

  updateModelName: async (idModel: string, newModelName: string): Promise<void> => {
    return new Promise(async (
      resolve: () => void,
      reject: (reason?: any) => void
    ) => {
      try {
        await axios.put(
          `${Config.API_URL}/Model/UpdateModel`,
          {
            idModel,
            name: newModelName
          }
        )
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },

  removeAnnotation: async (idAnnotation: string): Promise<boolean> => {
    return new Promise(async (
      resolve: (result: boolean) => void,
      reject: (reason?: any) => void
    ) => {
      try {
        const response = await axios.delete(`${Config.API_URL}/Annotation/${idAnnotation}`)
        response.data ? resolve(true) : reject()
      } catch (err) {
        reject(err)
      }
    })
  },

  removeDocument: async (idDocument: string): Promise<void> => {
    return new Promise(async (
      resolve: () => void,
      reject: (reason?: any) => void
    ) => {
      try {
        await axios.delete(`${Config.API_URL}/Document/${idDocument}`)
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },

  getAnnotationForDocument: (idDocument: string): Promise<IAnnotation[]> => {
    return new Promise(async (
      resolve: (value: IAnnotation[]) => void,
      reject: (reason?: any) => void
    ) => {
      try {
        const response: AxiosResponse<any, any> = await axios.get(
          `${Config.API_URL}/Annotation/GetModelByDocument?idDocument=${idDocument}`
        )
        resolve(response.data)
      } catch (err) {
        reject(err)
      }
    })
  },

  getDocument: (idDocument: string): Promise<IDocument> => {
    return new Promise(async (
      resolve: (value: IDocument) => void,
      reject: (reason?: any) => void
    ) => {
      try {
        const response: AxiosResponse<any, any> = await axios.get(
          `${Config.API_URL}/Document/${idDocument}`
        )
        resolve(response.data)
      } catch (err) {
        reject(err)
      }
    })
  },
}

export default ModelProvider