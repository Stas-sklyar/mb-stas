import AnnotationTypeIcon from "../AnnotationTypeIcon/AnnotationTypeIcon"
import s from "./AnnotationTag.module.scss"

interface IProps {
  annotationLabel: string
  annotationType?: number
  color: string
}

export default function AnnotationTag({ annotationLabel, annotationType, color }: IProps) {

  return (
    <div
      className={s["AnnotationTag"]}
      style={{ color: "#" + color }}
    >
      {annotationType
        ? <span className={s["AnnotationTag-Icon"]}>
          <AnnotationTypeIcon annotationType={annotationType} />
        </span>
        : ""
      }

      <span style={{ color: "#" + color }}>
        {annotationLabel}
      </span>
    </div>
  )
}