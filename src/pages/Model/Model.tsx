import { Row, Col, message, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import ModelPageHeader from './ModelPageHeader/ModelPageHeader'
import { incrementAmountOfFiles, ModelPageMode, setDocuments, updateActiveFileIndex, updateMode } from '../../reducers/modelReducer'
import { RootState } from '../../reducers/rootReducers'
import AnnotationsList from './AnnotationsList/AnnotationsList'
import DocumentViewer from './DocumentViewer/DocumentViewer'
import s from './Model.module.scss'
import DocumentsList from './DocumentsList/DocumentsList'
import Layout from '../../components/Layout/Layout'
import NoDocuments from './NoDocuments/NoDocuments'
import IModel from '../../models/Model'
import ModelProvider from '../../providers/model.provider'
import { useEffect, useState } from 'react'
import { NoticeType } from 'antd/es/message/interface'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Model() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const mode = useSelector((state: RootState) => state.model.mode)
  const amountOfFiles = useSelector((state: RootState) => state.model.amountOfFiles)
  const [messageApi, contextHolder] = message.useMessage()
  const { modelId } = useParams()

  const [modelName, setModelName] = useState<string>("")
  const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)

  const getModelData = (modelId: string) => {
    setLoaderIsActive(true)

    ModelProvider.getModelData(modelId)
      .then((modelData: IModel) => {
        setModelName(modelData?.name || "")
        dispatch(setDocuments(modelData.documents))

        if (modelData.documents.length > 0) {
          dispatch(updateMode(ModelPageMode.ANNOTATION))
        }

        for (let i = 0; i < modelData.documents.length; i++) {
          dispatch(incrementAmountOfFiles())
          dispatch(updateActiveFileIndex(0))
        }
      })
      .catch(err => {
        showAlert("error", t("ModelPage.alerts.errorWhileGetingInfoAboutModel"))
        console.error("An error occurred on the server while geting info about model", err)
      })
      .finally(() => {
        setLoaderIsActive(false)
      })
  }

  const showAlert = (type: NoticeType | undefined, message: string): void => {
    messageApi.open({
      type: type,
      content: message
    })
  }

  useEffect(() => {
    modelId && getModelData(modelId)
  }, [modelId])

  return (
    <Spin tip={t("shared.spinText")} spinning={loaderIsActive}>
      <Layout>
        <ModelPageHeader modelName={modelName} />

        <div className={s["ModelPage"]}>
          <Row className={s["ModelPage-Row"]}>
            <Col className={s["ModelPage-Col"]} flex="290px">
              <DocumentsList />
            </Col>

            <Col className={s["ModelPage-Col"]} flex="auto">
              {mode !== ModelPageMode.EMPTY && <DocumentViewer />}
              {mode === ModelPageMode.EMPTY && <NoDocuments />}
            </Col>

            <Col className={s["ModelPage-Col"]} flex="340px">
              {mode !== ModelPageMode.EMPTY && <AnnotationsList />}
            </Col>
          </Row>
        </div>

        {contextHolder}
      </Layout>
    </Spin>
  )
}
