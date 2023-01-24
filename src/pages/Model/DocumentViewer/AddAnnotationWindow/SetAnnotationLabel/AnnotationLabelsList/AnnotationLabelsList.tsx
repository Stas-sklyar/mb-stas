import { useState } from 'react'
import { useSelector } from 'react-redux'
import AnnotationTag from '../../../../../../components/AnnotationTag/AnnotationTag'
import { RootState } from '../../../../../../reducers/rootReducers'
import { INewAnnotationInfo } from '../../AddAnnotationWindow'
import s from '../../AddAnnotationWindow.module.scss'
import { IAnnotationLabel } from '../SetAnnotationLabel'

interface IProps {
  setNewAnnotationInfo(annotationLabel: INewAnnotationInfo): void
  newAnnotationInfo: INewAnnotationInfo
  setSelectedExistingAnnotationToggle(value: boolean): void
  setSelectedExistingAnnotationId(id: string): void
}

export default function AnnotationLabelsList({ newAnnotationInfo, setNewAnnotationInfo, setSelectedExistingAnnotationToggle, setSelectedExistingAnnotationId }: IProps) {
  const annotationLabels = useSelector((state: RootState) => state.model.annotationLabels)

  const [selectedLabelIndex, setSelectedLabelIndex] = useState<number | null>(null)

  const onSelectLabel = (index: number, value: string, color: string, id: string) => {
    setSelectedLabelIndex(index)
    setNewAnnotationInfo({
      ...newAnnotationInfo,
      annotationLabel: value,
      colorHexa: color.replace("#", "")
    })
    setSelectedExistingAnnotationToggle(true)
    setSelectedExistingAnnotationId(id)
  }

  return (
    <>
      {annotationLabels && annotationLabels.length > 0 &&
        annotationLabels.map((label: IAnnotationLabel, index: number) => (
          <div
            key={index}
            className={
              selectedLabelIndex === index
                ? s["AddAnnotationWindow-Label"] + " " + s["AddAnnotationWindow-Label__Active"]
                : s["AddAnnotationWindow-Label"]
            }
            onClick={() => onSelectLabel(index, label.name, label.iconColor, label.id)}
          >
            <AnnotationTag
              annotationLabel={label.name}
              annotationType={0}
              color={label.iconColor}
            />
          </div>
        ))
      }
    </>
  )
}