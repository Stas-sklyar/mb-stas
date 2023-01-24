import { CloseOutlined, LeftOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import AnnotationTag from '../../../../../components/AnnotationTag/AnnotationTag'
import { IAddAnnotationWindowMode, INewAnnotationInfo } from '../AddAnnotationWindow'
import s from '../AddAnnotationWindow.module.scss'

interface IProps {
  addAnnotationWindowMode: IAddAnnotationWindowMode
  setAddAnnotationWindowMode(mode: IAddAnnotationWindowMode): void
  newAnnotationInfo: INewAnnotationInfo
  setNewAnnotationInfo(newAnnotationInfo: INewAnnotationInfo): void
  clearSelectedWordsIdArr(): void
}

export default function AddAnnotationWindowHeader({ addAnnotationWindowMode, setAddAnnotationWindowMode, newAnnotationInfo, setNewAnnotationInfo, clearSelectedWordsIdArr }: IProps) {

  const onCloseAddAnnotationWindow = (): void => {
    clearSelectedWordsIdArr()
    setNewAnnotationInfo({
      ...newAnnotationInfo,
      annotationLabel: "",
      annotationType: 0,
      colorHexa: ""
    })
  }

  return (
    <Row
      className={s["AddAnnotationWindow-Header"]}
      align="middle"
      justify="space-between"
    >
      <Col>
        <Row align="middle">
          {
            addAnnotationWindowMode === IAddAnnotationWindowMode.SET_ANNOTATION_TYPE &&
            <LeftOutlined
              className={s["AddAnnotationWindow-BackIcon"]}
              onClick={() => setAddAnnotationWindowMode(IAddAnnotationWindowMode.SET_ANNOTATION_LABEL)}
            />
          }

          {newAnnotationInfo.annotationLabel && newAnnotationInfo.colorHexa &&
            <AnnotationTag
              annotationLabel={newAnnotationInfo.annotationLabel}
              annotationType={newAnnotationInfo.annotationType}
              color={newAnnotationInfo.colorHexa}
            />
          }
        </Row>
      </Col>

      <Col>
        <CloseOutlined onClick={onCloseAddAnnotationWindow} />
      </Col>
    </Row>
  )
}