import s from "../../AddAnnotationWindow.module.scss"
import { Col, Input, Row } from "antd"
import { INewAnnotationInfo } from "../../AddAnnotationWindow"
import { useEffect, useState } from "react"
import getRandomColor from "../../../../../../scripts/getRandomColor"
import { useTranslation } from "react-i18next"

interface IProps {
  setNewAnnotationInfo(annotationLabel: INewAnnotationInfo): void
  newAnnotationInfo: INewAnnotationInfo
}

export default function SetAnnotationLabelFooter({ setNewAnnotationInfo, newAnnotationInfo }: IProps) {
  const { t } = useTranslation()
  const [randomColor, setRandomColor] = useState<string>("")

  const onLableChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewAnnotationInfo({
      ...newAnnotationInfo,
      annotationLabel: e.target.value,
      colorHexa: randomColor
    })
  }

  useEffect(() => {
    setRandomColor(getRandomColor())
  }, [])

  return (
    <Row
      className={s["AddAnnotationWindow-Footer"]}
      align="middle"
    >
      <Col className={s["AddAnnotationWindow-InputLabel"]}>
        {t("ModelPage.createNewAnnotationWindow.selectAnnotationLabelInputLabel")}
      </Col>

      <Col flex="auto">
        <Input
          className={s["AddAnnotationWindow-Input"]}
          onChange={onLableChange}
        />
      </Col>
    </Row>
  )
}