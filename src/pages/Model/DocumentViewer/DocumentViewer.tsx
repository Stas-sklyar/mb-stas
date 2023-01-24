import { useEffect, useState } from 'react'
import s from './DocumentViewer.module.scss'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import ViewerControls from './ViewerControls/ViewerControls'
import WordsContainers from './WordsContainers/WordsContainers'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../reducers/rootReducers'
import ModelProvider from '../../../providers/model.provider'
import { message } from 'antd'
import { NoticeType } from 'antd/es/message/interface'
import { IAnnotationLabel } from './AddAnnotationWindow/SetAnnotationLabel/SetAnnotationLabel'
import { IAnnotation, ModelPageMode, setAnnotationLabels, setAnnotations, setAnnotationTypes } from '../../../reducers/modelReducer'
import { useParams } from 'react-router-dom'
import IWord from '../../../models/Word'
import { useTranslation } from 'react-i18next'
import Config from '../../../config'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'standard_fonts/'
}

export default function DocumentViewer() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { modelId } = useParams()

  const [messageApi, contextHolder] = message.useMessage()

  const documents = useSelector((state: RootState) => state.model.documents)
  const activeFileIndex = useSelector((state: RootState) => state.model.activeFileIndex)
  const updateAnnotationsToggle = useSelector((state: RootState) => state.model.updateAnnotationsToggle)
  const mode = useSelector((state: RootState) => state.model.mode)

  const [numPages, setNumPages] = useState<number>(0)
  const [currentPageNum, setCurrentPageNum] = useState<number>(1)

  const onDocumentLoadSuccess = (PDFData: any): void => {
    setNumPages(PDFData._pdfInfo.numPages)
  }

  const onPageChange = (action: "increase" | "decrease"): void => {
    const nextPageNum = action === "increase" ? currentPageNum + 1 : currentPageNum - 1

    if (nextPageNum > numPages || nextPageNum === 0) return

    setCurrentPageNum(nextPageNum)
  }

  const fetchAnnotationsList = (modelId: string) => {
    ModelProvider.fetchAnnotationsList(modelId)
      .then((annotationsList: IAnnotation[]) => {
        getAnnotationLabels(annotationsList)
        dispatch(setAnnotationTypes(Config.ANNOTATION_TYPES))
        dispatch(setAnnotations(annotationsList))
      })
      .catch(err => {
        showAlert("error", t("ModelPage.alerts.errorWhileGetingAnnotationsList"))
        console.error("An error occurred on the server while geting annotations list", err)
      })
  }

  const getAnnotationLabels = (annotationsList: IAnnotation[]) => {
    const annotationLabels: IAnnotationLabel[] = ModelProvider.getAnnotationLabels(annotationsList)
    dispatch(setAnnotationLabels(annotationLabels))
  }

  const showAlert = (type: NoticeType | undefined, message: string): void => {
    messageApi.open({
      type: type,
      content: message
    })
  }

  useEffect(() => {
    modelId && fetchAnnotationsList(modelId)
  }, [modelId, updateAnnotationsToggle])

  return (
    <>
      {documents.length > 0 && activeFileIndex !== null && documents[activeFileIndex] &&
        <div className={s["DocumentViewer"]}>
          <div>
            <Document
              file={documents[activeFileIndex].url}
              onLoadSuccess={onDocumentLoadSuccess}
              options={options}
              error={t("ModelPage.documentViewerSection.errorWhileLoadingPDFFile") + ""}
              className={s["DocumentViewer-Document"]}
            >
              <Page
                pageNumber={currentPageNum}
                width={795}
                className={s["DocumentViewer-Page"]}
              />

              {(mode === ModelPageMode.ANNOTATION && (documents[activeFileIndex].pages[currentPageNum - 1]?.words.length > 0))
                ? <WordsContainers
                  words={documents[activeFileIndex].pages[currentPageNum - 1]?.words}
                />
                : ""}
            </Document>
          </div>
        </div>
      }

      {numPages && documents.length > 0
        ? <div className={s["DocumentViewer-Controls"]}>
          <ViewerControls
            onPageChange={onPageChange}
            currentPageNum={currentPageNum}
            setCurrentPageNum={setCurrentPageNum}
            numPages={numPages}
          />
        </div>
        : ""
      }

      {contextHolder}
    </>
  )
}