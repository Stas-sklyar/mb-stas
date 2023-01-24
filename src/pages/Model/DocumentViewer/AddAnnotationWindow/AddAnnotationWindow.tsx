import { Button, Row } from 'antd'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ModelProvider from '../../../../providers/model.provider'
import { IAnnotation, addNewAnnotation, updateAnnotationsToggle } from '../../../../reducers/modelReducer'
import s from './AddAnnotationWindow.module.scss'
import AddAnnotationWindowHeader from './AddAnnotationWindowHeader/AddAnnotationWindowHeader'
import SetAnnotationLabel from './SetAnnotationLabel/SetAnnotationLabel'
import SetAnnotationType from './SetAnnotationType/SetAnnotationType'
import { useTranslation } from 'react-i18next'
import IAnntotationPostData from '../../../../models/AnntotionPostData'
import { RootState } from '../../../../reducers/rootReducers'
import { NoticeType } from 'antd/es/message/interface'

export enum IAddAnnotationWindowMode {
  "SET_ANNOTATION_LABEL" = "SET_ANNOTATION_LABEL",
  "SET_ANNOTATION_TYPE" = "SET_ANNOTATION_TYPE"
}

export interface INewAnnotationInfo {
  annotationLabel: string
  annotationType: number
  colorHexa: string
}

interface IProps {
  left: number
  top: number
  width: number
  clearSelectedWordsIdArr(): void
  selectedWordsIdArr: string[]
  showAlert(type: NoticeType | undefined, message: string): void
}

export default function AddAnnotationWindow({ left, top, width, clearSelectedWordsIdArr, selectedWordsIdArr, showAlert }: IProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const annotationList = useSelector((state: RootState) => state.model.annotationList)

  const [addAnnotationWindowMode, setAddAnnotationWindowMode] = useState<IAddAnnotationWindowMode>(IAddAnnotationWindowMode.SET_ANNOTATION_LABEL)
  const [selectedExistingAnnotationToggle, setSelectedExistingAnnotationToggle] = useState<boolean>(false)
  const [selectedExistingAnnotationId, setSelectedExistingAnnotationId] = useState<string>()
  const [newAnnotationInfo, setNewAnnotationInfo] = useState<INewAnnotationInfo>({
    annotationLabel: "",
    annotationType: 0,
    colorHexa: ""
  })
  const { modelId } = useParams()

  const createNewAnnotation = () => {
    clearSelectedWordsIdArr()

    if (selectedExistingAnnotationToggle) {
      connectExistingAnnotationWithWords()
      return
    }

    if (modelId) {
      const newAnnotationData: IAnntotationPostData = {
        idModel: modelId,
        name: newAnnotationInfo.annotationLabel,
        type: newAnnotationInfo.annotationType,
        colorHexa: newAnnotationInfo.colorHexa
      }

      ModelProvider.createNewAnnotation(newAnnotationData, selectedWordsIdArr)
        .then((newAnnotationData: IAnnotation) => {
          dispatch(addNewAnnotation(newAnnotationData))
          dispatch(updateAnnotationsToggle())
        })
        .catch(err => {
          showAlert("error", t("ModelPage.alerts.errorWhileCreatingNewAnnotation"))
          console.error("An error occurred on the server while creating a new annotation", err)
        })
    }
  }

  const connectExistingAnnotationWithWords = () => {
    setSelectedExistingAnnotationToggle(false)

    if (modelId && selectedExistingAnnotationId) {
      ModelProvider.connectExistingAnnotationWithWords(selectedExistingAnnotationId, selectedWordsIdArr)
        .then(() => {
          const selectedAnnotation: IAnnotation | undefined = annotationList.find((annotation: IAnnotation) => (annotation.idAnnotation === selectedExistingAnnotationId))

          if (selectedAnnotation) {
            dispatch(addNewAnnotation(selectedAnnotation))
            dispatch(updateAnnotationsToggle())
          } else {
            showAlert("error", t("ModelPage.alerts.errorWhileCreatingNewAnnotation"))
            console.error("An error occurred on the server while creating a new annotation")
          }
        })
        .catch(err => {
          showAlert("error", t("ModelPage.alerts.errorWhileCreatingNewAnnotation"))
          console.error("An error occurred on the server while creating a new annotation", err)
        })
    }
  }

  return (
    <div
      className={s["AddAnnotationWindow"]}
      style={{ left: left + width + 20, top }}
    >
      <AddAnnotationWindowHeader
        clearSelectedWordsIdArr={clearSelectedWordsIdArr}
        addAnnotationWindowMode={addAnnotationWindowMode}
        setAddAnnotationWindowMode={setAddAnnotationWindowMode}
        newAnnotationInfo={newAnnotationInfo}
        setNewAnnotationInfo={setNewAnnotationInfo}
      />

      {addAnnotationWindowMode === IAddAnnotationWindowMode.SET_ANNOTATION_LABEL &&
        <div className={s["AddAnnotationWindow-Title"]}>
          {t("ModelPage.createNewAnnotationWindow.selectAnnotationLabelTitle")}
        </div>
      }

      {addAnnotationWindowMode === IAddAnnotationWindowMode.SET_ANNOTATION_LABEL &&
        <SetAnnotationLabel
          setAddAnnotationWindowMode={setAddAnnotationWindowMode}
          setNewAnnotationInfo={setNewAnnotationInfo}
          newAnnotationInfo={newAnnotationInfo}
          setSelectedExistingAnnotationToggle={setSelectedExistingAnnotationToggle}
          setSelectedExistingAnnotationId={setSelectedExistingAnnotationId}
        />
      }

      {addAnnotationWindowMode === IAddAnnotationWindowMode.SET_ANNOTATION_TYPE &&
        <SetAnnotationType
          setAddAnnotationWindowMode={setAddAnnotationWindowMode}
          setNewAnnotationInfo={setNewAnnotationInfo}
          newAnnotationInfo={newAnnotationInfo}
        />
      }

      <Row
        className={s["AddAnnotationWindow-BtnBox"]}
        justify="end"
      >
        <Button
          onClick={() => addAnnotationWindowMode === IAddAnnotationWindowMode.SET_ANNOTATION_LABEL && !selectedExistingAnnotationToggle
            ? setAddAnnotationWindowMode(IAddAnnotationWindowMode.SET_ANNOTATION_TYPE)
            : createNewAnnotation()
          }
          disabled={
            (
              addAnnotationWindowMode === IAddAnnotationWindowMode.SET_ANNOTATION_LABEL
              && !newAnnotationInfo.annotationLabel
            )
            ||
            (
              addAnnotationWindowMode === IAddAnnotationWindowMode.SET_ANNOTATION_TYPE
              && !newAnnotationInfo.annotationType
            )
          }
        >
          OK
        </Button>
      </Row>
    </div>
  )
}