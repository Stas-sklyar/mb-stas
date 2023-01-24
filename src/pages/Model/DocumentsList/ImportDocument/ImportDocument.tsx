import { Spin, message } from 'antd'
import { NoticeType } from 'antd/es/message/interface'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import IDocument from '../../../../models/Document'
import ModelProvider from '../../../../providers/model.provider'
import { updateMode, ModelPageMode, incrementAmountOfFiles, updateActiveFileIndex, addNewDocument } from '../../../../reducers/modelReducer'
import { RootState } from '../../../../reducers/rootReducers'
import s from './ImportDocument.module.scss'
import { Trans, useTranslation } from 'react-i18next'
import { FileUploader } from 'react-drag-drop-files'
import { Storage } from 'aws-amplify'
import initWebsocket from '../../../../scripts/initWebsocket'
import { useState } from 'react'

export default function ImportDocument() {
  const socket = initWebsocket()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { modelId } = useParams()
  const [messageApi, contextHolder] = message.useMessage()

  const amountOfFiles = useSelector((state: RootState) => state.model.amountOfFiles)

  const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)

  const uploadFileHandler = async (file: File, modelId: string): Promise<void> => {
    setLoaderIsActive(true)

    try {
      const uploadedFileURL = await getUploadedFileUrl(file)
      const uploadedDocumentWithoutOCR = await ModelProvider.uploadPDFFile(modelId, uploadedFileURL)
      const uploadedDocumentId = uploadedDocumentWithoutOCR.idDocument

      socket.emit("message", uploadedDocumentId, async () => {
        const uploadedAndProcessedDocument = await getDocument(uploadedDocumentId)
        documentSuccessfullyUploadedAndProcessedHandler(uploadedAndProcessedDocument)
      })

    } catch (exception) {
      showAlert("error", t("ModelPage.alerts.errorWhileUploadingPDF"))
      console.error("An error occurred on the server while uploading a new document", exception)
    } finally {
      setLoaderIsActive(false)
    }
  }

  const getUploadedFileUrl = async (file: File): Promise<string> => {
    try {
      const uploadedFileToAWS = await Storage.put(
        file.name,
        file,
        { expires: calcExpireDate() }
      )
      const uploadedFileURL = await Storage.get(uploadedFileToAWS.key)

      return uploadedFileURL
    } catch (err) {
      throw err
    }
  }

  const calcExpireDate = (): Date => {
    const currentDate: Date = new Date()
    const expireDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 100))

    return expireDate
  }

  const getDocument = async (documentId: string): Promise<IDocument> => {
    try {
      const document = await ModelProvider.getDocument(documentId)

      return document
    } catch (err) {
      showAlert("error", t("ModelPage.alerts.errorWhileGetingDocument"))
      console.error("An error occurred on the server while geting geting document", err)
      throw err
    }
  }

  const documentSuccessfullyUploadedAndProcessedHandler = (uploadedAndProcessedDocument: IDocument): void => {
    showAlert("success", t("ModelPage.alerts.successfullyUploadedPDFFileAlert"))
    dispatch(updateMode(ModelPageMode.ANNOTATION))
    dispatch(addNewDocument(uploadedAndProcessedDocument))
    dispatch(incrementAmountOfFiles())
    dispatch(updateActiveFileIndex(amountOfFiles))
  }

  const fileUploaderHandler = async (files: FileList): Promise<void> => {

    if (files && files?.length > 0 && modelId) {

      for (let i = 0; i < files.length; i++) {
        const file: File = files[i]
        await uploadFileHandler(file, modelId)
      }

    }

    clearInputAfterUploadingFiles()
  }

  const handleErrorWhileUploadingNotPDF = (): void => {
    showAlert("error", t("ModelPage.alerts.errorWhileUploadingNotPDF"))
    console.error(t("ModelPage.alerts.errorWhileUploadingNotPDF"))
  }

  const clearInputAfterUploadingFiles = (): void => {
    const $elemInputTypeFile = document.getElementsByName("file")[0]

    $elemInputTypeFile.addEventListener("click", clearInput)
    $elemInputTypeFile.click()
    removeEventListener()

    function clearInput(e: any) {
      e.preventDefault()
      e.target.files = null
      e.target.value = null
    }
    function removeEventListener() {
      $elemInputTypeFile.removeEventListener("click", clearInput)
    }
  }

  const showAlert = (type: NoticeType | undefined, message: string): void => {
    messageApi.open({
      type: type,
      content: message
    })
  }

  return (
    <FileUploader
      handleChange={fileUploaderHandler}
      name="file"
      types={["PDF"]}
      multiple
      hoverTitle=" "
      onTypeError={() => handleErrorWhileUploadingNotPDF()}
    >
      <Spin
        tip={t("shared.spinText")}
        spinning={loaderIsActive}
      >
        <div className={s["ImportDocument"]}>
          <svg className={s["ImportDocument-Icon"]} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#F2F0FF" />
            <path d="M16.6667 23.3333L20 20M20 20L23.3334 23.3333M20 20V27.5M26.6667 23.9524C27.6846 23.1117 28.3334 21.8399 28.3334 20.4167C28.3334 17.8854 26.2813 15.8333 23.75 15.8333C23.5679 15.8333 23.3976 15.7383 23.3051 15.5814C22.2184 13.7374 20.212 12.5 17.9167 12.5C14.4649 12.5 11.6667 15.2982 11.6667 18.75C11.6667 20.4718 12.3629 22.0309 13.4891 23.1613" stroke="#9482FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div className={s["ImportDocument-Title"]}>
            <Trans
              i18nKey="ModelPage.documentsListSection.importDocumentTitle"
              components={{
                span: <span>Click to upload</span>,
              }}
            >
            </Trans>
          </div>

          <div className={s["ImportDocument-Subtitle"]}>
            {t("ModelPage.documentsListSection.importDocumentSubtitle")}
          </div>
        </div>
      </Spin>

      {contextHolder}
    </FileUploader>
  )
}