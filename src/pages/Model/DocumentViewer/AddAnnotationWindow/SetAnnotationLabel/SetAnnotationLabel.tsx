import { IAddAnnotationWindowMode, INewAnnotationInfo } from '../AddAnnotationWindow'
import AnnotationLabelsList from './AnnotationLabelsList/AnnotationLabelsList'
import SetAnnotationLabelFooter from './SetAnnotationLabelFooter/SetAnnotationLabelFooter'

export interface IAnnotationLabel {
  id: string
  name: string
  iconColor: string
  annotationLabelType: number
}

interface IProps {
  setAddAnnotationWindowMode(mode: IAddAnnotationWindowMode): void
  setNewAnnotationInfo(annotationLabel: INewAnnotationInfo): void
  newAnnotationInfo: INewAnnotationInfo
  setSelectedExistingAnnotationToggle(value: boolean): void
  setSelectedExistingAnnotationId(id: string): void
}

export default function SetAnnotationLabel({ setNewAnnotationInfo, newAnnotationInfo, setSelectedExistingAnnotationToggle, setSelectedExistingAnnotationId }: IProps) {

  return (
    <div>
      <AnnotationLabelsList
        setNewAnnotationInfo={setNewAnnotationInfo}
        newAnnotationInfo={newAnnotationInfo}
        setSelectedExistingAnnotationToggle={setSelectedExistingAnnotationToggle}
        setSelectedExistingAnnotationId={setSelectedExistingAnnotationId}
      />

      <SetAnnotationLabelFooter
        setNewAnnotationInfo={setNewAnnotationInfo}
        newAnnotationInfo={newAnnotationInfo}
      />
    </div>
  )
}