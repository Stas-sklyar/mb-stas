import { Col, message, Popover, Row } from 'antd'
import { NoticeType } from 'antd/es/message/interface'
import { useDispatch, useSelector } from 'react-redux'
import AnnotationTypeIcon from '../../../../components/AnnotationTypeIcon/AnnotationTypeIcon'
import AnnotationTypeLabel from '../../../../components/AnnotationTypeLabel/AnnotationTypeLabel'
import ModelProvider from '../../../../providers/model.provider'
import { deleteAnnotation, ModelPageMode, updateAnnotationsToggle } from '../../../../reducers/modelReducer'
import { RootState } from '../../../../reducers/rootReducers'
import s from './Annotation.module.scss'
import { useTranslation } from 'react-i18next'

interface IProps {
  type: any
  iconColor: string
  name: string
  persent: number | undefined
  id: string
}

export default function Annotation({ type, iconColor: color, name, persent, id }: IProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [messageApi, contextHolder] = message.useMessage()
  const mode = useSelector((state: RootState) => state.model.mode)

  const onDeleteAnnotation = (): void => {
    ModelProvider.removeAnnotation(id)
      .then(() => {
        dispatch(deleteAnnotation(id))
        dispatch(updateAnnotationsToggle())
        showAlert("success", t("ModelPage.alerts.successfullyRemovedAnnotationAlert"))
      })
      .catch(err => {
        showAlert("error", t("ModelPage.alerts.errorWhileRemovingAnnotation"))
        console.error("An error occurred on the server while removing annotation", err)
      })
  }

  const showAlert = (type: NoticeType | undefined, message: string): void => {
    messageApi.open({
      type: type,
      content: message
    })
  }

  return (
    <div className={s["Annotation"]}>
      <Row justify="space-between" align="middle">
        <Col flex="auto" className={s["Annotation-Header"]}>
          <Row justify="space-between" align="middle">
            <Col>
              <div className={s["Annotation-Type"]} style={{ color: "#" + color }}>
                <div className={s["Annotation-IconType"]}>
                  <AnnotationTypeIcon annotationType={type} />
                </div>

                <AnnotationTypeLabel annotationType={type} />
              </div>
            </Col>

            <Col>
              <Row align="middle">
                {
                  (persent !== undefined && mode === ModelPageMode.ONLINE)
                    ? <div className={s["Annotation-Persent"]}>{persent + "%"}</div>
                    : ""
                }

                <svg
                  className={s["Annotation-DeleteIcon"]}
                  fill="none"
                  onClick={onDeleteAnnotation}
                >
                  <path d="M12.3333 5.00001V4.33334C12.3333 3.39992 12.3333 2.93321 12.1517 2.57669C11.9919 2.26308 11.7369 2.00812 11.4233 1.84833C11.0668 1.66667 10.6001 1.66667 9.66667 1.66667H8.33333C7.39991 1.66667 6.9332 1.66667 6.57668 1.84833C6.26308 2.00812 6.00811 2.26308 5.84832 2.57669C5.66667 2.93321 5.66667 3.39992 5.66667 4.33334V5.00001M7.33333 9.58334V13.75M10.6667 9.58334V13.75M1.5 5.00001H16.5M14.8333 5.00001V14.3333C14.8333 15.7335 14.8333 16.4335 14.5608 16.9683C14.3212 17.4387 13.9387 17.8212 13.4683 18.0609C12.9335 18.3333 12.2335 18.3333 10.8333 18.3333H7.16667C5.76654 18.3333 5.06647 18.3333 4.53169 18.0609C4.06129 17.8212 3.67883 17.4387 3.43915 16.9683C3.16667 16.4335 3.16667 15.7335 3.16667 14.3333V5.00001" stroke="#475467" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className={s["Annotation-Name"]}>{name}</Row>

      {contextHolder}
    </div>
  )
}