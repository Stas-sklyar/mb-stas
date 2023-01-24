import { useState } from 'react'
import { useSelector } from 'react-redux'
import AnnotationTypeIcon from '../../../../../../components/AnnotationTypeIcon/AnnotationTypeIcon'
import AnnotationTypeLabel from '../../../../../../components/AnnotationTypeLabel/AnnotationTypeLabel'
import { RootState } from '../../../../../../reducers/rootReducers'
import { INewAnnotationInfo } from '../../AddAnnotationWindow'
import s from '../../AddAnnotationWindow.module.scss'

interface IProps {
  setNewAnnotationInfo(annotationLabel: INewAnnotationInfo): void
  newAnnotationInfo: INewAnnotationInfo
}

export default function AnnotationTypesList({ newAnnotationInfo, setNewAnnotationInfo }: IProps) {
  const annotationTypes = useSelector((state: RootState) => state.model.annotationTypes)

  const [selectedTypeIndex, setSelectedTypeIndex] = useState<number | null>(null)

  const onSelectLabelType = (index: number, digitalIdOfLabelType: number) => {
    setSelectedTypeIndex(index)
    setNewAnnotationInfo({ ...newAnnotationInfo, annotationType: digitalIdOfLabelType })
  }

  return (
    <>
      {
        annotationTypes.map((annotationDigitalTypeId: number, index: number) => (
          <div
            key={index}
            className={index === selectedTypeIndex
              ? s["AddAnnotationWindow-AnnotationType"] + " " + s["AddAnnotationWindow-AnnotationType__Active"]
              : s["AddAnnotationWindow-AnnotationType"]
            }
            onClick={() => onSelectLabelType(index, annotationDigitalTypeId)}
          >
            <div className={s["AddAnnotationWindow-AnnotationTypeIcon"]}>
              <AnnotationTypeIcon annotationType={annotationDigitalTypeId} />
            </div>

            <AnnotationTypeLabel annotationType={annotationDigitalTypeId} />
          </div>
        ))
      }
    </>
  )
}