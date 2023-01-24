import { useState } from 'react'
import s from './DocumentPreview.module.scss'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../reducers/rootReducers'
import { ModelPageMode, removeFile, updateActiveFileIndex } from '../../../../reducers/modelReducer'
import IDocument from '../../../../models/Document'
import { useTranslation } from 'react-i18next'
import { Spin, message } from 'antd'
import ModelProvider from '../../../../providers/model.provider'
import { NoticeType } from 'antd/es/message/interface'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'standard_fonts/'
}

export default function DocumentPreview() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [messageApi, contextHolder] = message.useMessage()

  const documents = useSelector((state: RootState) => state.model.documents)
  const activeFileIndex = useSelector((state: RootState) => state.model.activeFileIndex)
  const mode = useSelector((state: RootState) => state.model.mode)

  const [numPages, setNumPages] = useState(null)
  const [loaderIsActive, setLoaderIsActive] = useState<boolean>(true)

  const onDocumentLoadSuccess = (numPages: any) => {
    setNumPages(numPages)
    setLoaderIsActive(false)
  }

  const deleteDocument = (documentIndex: number, idDocument: string) => {
    ModelProvider.removeDocument(idDocument)
      .then(() => {
        dispatch(removeFile(documentIndex))
        showAlert("success", t("ModelPage.alerts.successfullyRemovedDocumentAlert"))
      })
      .catch(err => {
        showAlert("error", t("ModelPage.alerts.errorWhileRemovingDocument"))
        console.error("An error occurred on the server while removing a document", err)
      })
  }

  const showAlert = (type: NoticeType | undefined, message: string): void => {
    messageApi.open({
      type: type,
      content: message
    })
  }

  return (
    <>
      {documents && documents.length > 0 && documents.map((document: IDocument, index: number) => (
        <Spin
          tip={t("shared.spinText")}
          spinning={loaderIsActive}
          key={index}
        >
          <div
            className={activeFileIndex === index ? s["DocumentPreview"] + " " + s["DocumentPreview__Active"] : s["DocumentPreview"]}
            onClick={() => dispatch(updateActiveFileIndex(index))}
          >
            <div className={s["DocumentPreview-Document"]}>
              <Document
                file={document.url}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
                error={
                  <div className={s["DocumentPreview-FailedToLoadPDFLabel"]}>
                    {t("ModelPage.documentViewerSection.errorWhileLoadingPreviewOfPDFFile")}
                  </div>
                }
                onLoadError={() => setLoaderIsActive(false)}
                loading=""
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    width={95}
                    pageNumber={index + 1}
                    className={s["DocumentPreview-Page"]}
                  />
                ))}
              </Document>
            </div>

            <div className={s["DocumentPreview-FileName"]}>
              <span>{document.name ? document.name : "Document has not name"}</span>
            </div>

            <div className={s["DocumentPreview-Status"]}>
              {mode !== ModelPageMode.ONLINE
                ? t("shared.documentStates.enCourses")
                : t("shared.documentStates.online")
              }
            </div>

            <svg
              className={s["DocumentPreview-DeleteIcon"]}
              fill="none"
              onClick={() => deleteDocument(index, document.idDocument)}
            >
              <path d="M12.3333 5.00001V4.33334C12.3333 3.39992 12.3333 2.93321 12.1517 2.57669C11.9919 2.26308 11.7369 2.00812 11.4233 1.84833C11.0668 1.66667 10.6001 1.66667 9.66667 1.66667H8.33333C7.39991 1.66667 6.9332 1.66667 6.57668 1.84833C6.26308 2.00812 6.00811 2.26308 5.84832 2.57669C5.66667 2.93321 5.66667 3.39992 5.66667 4.33334V5.00001M7.33333 9.58334V13.75M10.6667 9.58334V13.75M1.5 5.00001H16.5M14.8333 5.00001V14.3333C14.8333 15.7335 14.8333 16.4335 14.5608 16.9683C14.3212 17.4387 13.9387 17.8212 13.4683 18.0609C12.9335 18.3333 12.2335 18.3333 10.8333 18.3333H7.16667C5.76654 18.3333 5.06647 18.3333 4.53169 18.0609C4.06129 17.8212 3.67883 17.4387 3.43915 16.9683C3.16667 16.4335 3.16667 15.7335 3.16667 14.3333V5.00001" stroke="#475467" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {contextHolder}
        </Spin>
      ))}
    </>
  )
}