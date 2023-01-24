import { CloseOutlined } from "@ant-design/icons"
import { Row, Col, Button, message } from "antd"
import { NoticeType } from "antd/es/message/interface"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import Config from "../../../config"
import ModelProvider from "../../../providers/model.provider"
import { ModelPageMode, updateMode } from "../../../reducers/modelReducer"
import { RootState } from "../../../reducers/rootReducers"
import { showWarningModal } from "../../../reducers/warningModalReducer"
import s from "./ModelPageHeader.module.scss"
import { useTranslation } from "react-i18next"
import EditModelName from "./EditModelName/EditModelName"

interface IProps {
  modelName: string
}

export default function ModelPageHeader({ modelName }: IProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { modelId } = useParams()
  const [messageApi, contextHolder] = message.useMessage()

  const mode = useSelector((state: RootState) => state.model.mode)
  const amountOfDocuments = useSelector((state: RootState) => state.model.amountOfFiles)
  const amountOfAnnotationPerDocument = useSelector((state: RootState) => state.model.amountOfAnnotationPerDocument)

  const onClickBackBtn = () => {
    window.location.href = Config.REDIRECT_URL_ON_MODEL_PAGE_HEADER
  }

  const showAlert = (type: NoticeType | undefined, message: string): void => {
    messageApi.open({
      type: type,
      content: message
    })
  }

  const numberOfAnnotationsPerDocumentMatchCondition = (): boolean => {
    for (let i = 0; i < amountOfAnnotationPerDocument.length; i++) {
      if (amountOfAnnotationPerDocument[i] < Config.MIN_NUMBER_OF_ANNOTATIONS_PER_DOCUMENT) {
        return false
      }
    }

    return true
  }

  const onClickTrainBtn = () => {
    if (amountOfDocuments < Config.MIN_NUMBER_OF_DOCUMENTS_FOR_TRAIN && !numberOfAnnotationsPerDocumentMatchCondition()) {
      dispatch(showWarningModal(
        t(
          "ModelPage.header.conditionsForTrainAreNotMetWarning",
          { v1: Config.MIN_NUMBER_OF_DOCUMENTS_FOR_TRAIN, v2: Config.MIN_NUMBER_OF_ANNOTATIONS_PER_DOCUMENT }
        )
      ))
    } else {
      modelId && ModelProvider.trainModel(modelId)
      dispatch(updateMode(ModelPageMode.ONLINE))
    }
  }

  const onClickEditBtn = () => {
    modelId && ModelProvider.createFromModel(modelId)
      .then((newModelId: string) => {
        navigate(`/model/${newModelId}`)
        dispatch(updateMode(ModelPageMode.ANNOTATION))
      })
      .catch(err => {
        showAlert("error", t("ModelPage.alerts.errorWhileCreatingNewModel"))
        console.error("An error occurred on the server while creating new model", err)
      })
  }

  const onChangeModelName = async (newModelName: string): Promise<string> => {
    return new Promise(async (
      resolve: (value: string) => void,
      reject: (reason?: any) => void
    ) => {
      if (modelId) {
        ModelProvider.updateModelName(modelId, newModelName)
          .then(() => {
            resolve(newModelName)
          })
          .catch(err => {
            showAlert("error", t("ModelPage.alerts.errorWhileUpdatingModelName"))
            console.error("An error occurred on the server while updating a model name", err)
            reject()
          })
      } else {
        showAlert("error", t("ModelPage.alerts.invalidModelId"))
        console.error("Invalid model id!")
        reject()
      }
    })
  }

  return (
    <Row
      className={s["Header"]}
      justify="space-between"
      align="middle"
    >
      <Row align="middle">
        <Col>
          <span
            className={s["Header-BackBtn"]}
            onClick={() => onClickBackBtn()}
          >
            <CloseOutlined />
          </span>
        </Col>

        <EditModelName
          srcName={modelName}
          onChangeAnnotationName={onChangeModelName}
        />
      </Row>

      <Col>
        {(mode === ModelPageMode.ANNOTATION || mode === ModelPageMode.EMPTY) &&
          <Button onClick={() => onClickTrainBtn()}>
            {t("ModelPage.header.labelForTrainBtn")}
          </Button>
        }

        {mode === ModelPageMode.ONLINE &&
          <Button onClick={() => onClickEditBtn()}>
            {t("ModelPage.header.labelForEditBtn")}
          </Button>
        }
      </Col>

      {contextHolder}
    </Row>
  )
}
