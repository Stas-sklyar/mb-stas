import { IAddAnnotationWindowMode, INewAnnotationInfo } from '../AddAnnotationWindow'
import s from '../AddAnnotationWindow.module.scss'
import AnnotationTypesList from './AnnotationTypesList/AnnotationTypesList'

interface IProps {
  setAddAnnotationWindowMode(mode: IAddAnnotationWindowMode): void
  setNewAnnotationInfo(annotationLabel: INewAnnotationInfo): void
  newAnnotationInfo: INewAnnotationInfo
}

export default function SetAnnotationType({ setNewAnnotationInfo, newAnnotationInfo }: IProps) {

  return (
    <div className={s["AddAnnotationWindow-SetAnnotationType"]}>
      <AnnotationTypesList
        newAnnotationInfo={newAnnotationInfo}
        setNewAnnotationInfo={setNewAnnotationInfo}
      />
    </div>
  )
}