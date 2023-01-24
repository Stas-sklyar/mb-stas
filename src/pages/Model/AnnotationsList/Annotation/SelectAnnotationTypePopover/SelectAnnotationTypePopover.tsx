import { Col, Row } from "antd"
import { useSelector } from "react-redux"
import AnnotationTypeIcon from "../../../../../components/AnnotationTypeIcon/AnnotationTypeIcon"
import AnnotationTypeLabel from "../../../../../components/AnnotationTypeLabel/AnnotationTypeLabel"
import { RootState } from "../../../../../reducers/rootReducers"
import s from "./SelectAnnotationTypePopover.module.scss"

interface IProps {
  onChangeAnnotationType(type: number): void
  setChangeAnnotationTypePopoverIsOpen(value: boolean): void
  currentAnnotationType: number
}

export default function SelectAnnotationTypePopover({
  onChangeAnnotationType,
  setChangeAnnotationTypePopoverIsOpen,
  currentAnnotationType
}: IProps) {
  const annotationTypes = useSelector((state: RootState) => state.model.annotationTypes)

  const onRowClick = (annotationDigitalTypeId: number) => {
    setChangeAnnotationTypePopoverIsOpen(false)
    onChangeAnnotationType(annotationDigitalTypeId)
  }

  return (
    <div className={s["SelectAnnotationTypePopover"]}>
      {
        annotationTypes
          .filter((annotationDigitalTypeId: number) => (
            annotationDigitalTypeId !== currentAnnotationType
          ))
          .map((annotationDigitalTypeId: number, index: number) => (
            <Row
              key={index}
              className={s["SelectAnnotationTypePopover-Row"]}
              align="middle"
              onClick={() => onRowClick(annotationDigitalTypeId)}
            >
              <Col className={s["SelectAnnotationTypePopover-Icon"]}>
                <AnnotationTypeIcon annotationType={annotationDigitalTypeId} />
              </Col>

              <Col>
                <AnnotationTypeLabel annotationType={annotationDigitalTypeId} />
              </Col>
            </Row>
          ))
      }
    </div>
  )
}