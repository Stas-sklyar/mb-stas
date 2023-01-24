import { useSelector } from 'react-redux'
import { IAnnotation, ModelPageMode } from '../../../reducers/modelReducer'
import { RootState } from '../../../reducers/rootReducers'
import Annotation from './Annotation/Annotation'
import s from './AnnotationsList.module.scss'
import NoAnnotations from './NoAnnotations/NoAnnotations'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import ModelProvider from '../../../providers/model.provider'
import { message } from 'antd'
import { NoticeType } from 'antd/es/message/interface'

export default function AnnotationsList() {
  const { t } = useTranslation()
  const [messageApi, contextHolder] = message.useMessage()

  const activeFileIndex = useSelector((state: RootState) => state.model.activeFileIndex)
  const documents = useSelector((state: RootState) => state.model.documents)
  const mode = useSelector((state: RootState) => state.model.mode)
  const updateAnnotationsToggle = useSelector((state: RootState) => state.model.updateAnnotationsToggle)

  const [annotationsForDocument, setAnnotationsForDocument] = useState<IAnnotation[]>([])

  const getAnnotationForDocument = (idDocument: string) => {
    ModelProvider.getAnnotationForDocument(idDocument)
      .then((annotations: IAnnotation[]) => {
        setAnnotationsForDocument(annotations)
      })
      .catch(err => {
        showAlert("error", t("ModelPage.alerts.errorWhileGetingAnnotationForDocument"))
        console.error("An error occurred on the server while geting annotations for document", err)
      })
  }

  const showAlert = (type: NoticeType | undefined, message: string): void => {
    messageApi.open({
      type: type,
      content: message
    })
  }

  useEffect(() => {
    documents[activeFileIndex] && getAnnotationForDocument(documents[activeFileIndex].idDocument)
  }, [activeFileIndex, updateAnnotationsToggle])

  return (
    <div className={s["AnnotationsList"]}>
      <h2 className={s["AnnotationsList-Title"]}>
        {t("ModelPage.annotationsListSection.title")}
      </h2>

      {
        mode !== ModelPageMode.EMPTY && annotationsForDocument.map((annotation: IAnnotation) => {
          return (
            <Annotation
              key={annotation.idAnnotation}
              type={annotation.type}
              iconColor={annotation.colorHexa}
              name={annotation.name}
              persent={annotation?.confidence}
              id={annotation.idAnnotation}
            />
          )
        })
      }

      {mode === ModelPageMode.EMPTY &&
        <NoAnnotations />
      }

      {contextHolder}
    </div>
  )
}