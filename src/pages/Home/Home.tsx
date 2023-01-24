import { message, Layout, Input, Button } from "antd"
import { NoticeType } from "antd/es/message/interface"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Config from "../../config"
import HomeProvider from "../../providers/home.provider"
import s from "./Home.module.scss"
import { useTranslation } from "react-i18next"

export default function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [projectName, setProjectName] = useState<string>("")
  const [messageApi, contextHolder] = message.useMessage()

  const handleOk = (): void => {
    if (projectName.length < 4) {
      showAlert("error", t("HomePage.shortModelNameErrorAlert"))
      return
    }

    HomeProvider.createModel(projectName)
      .then((newModelId: string) => {
        showAlert("success", t("HomePage.successfullyCreatedModelAlert"))
        navigate(`/model/${newModelId}`)
      })
      .catch(err => {
        showAlert("error", t("HomePage.errorWhileCreatingModelAlert"))
        console.error("An error occurred on the server while creating a new model", err)
      })
  }

  const handleCancel = (): void => {
    window.location.href = Config.REDIRECT_URL_ON_HOMEPAGE
  }

  const showAlert = (type: NoticeType | undefined, message: string): void => {
    messageApi.open({
      type: type,
      content: message
    })
  }

  return (
    <Layout>

      <div className={s["Home-ModalWrapper"]}>
        <div className={s["Home-Modal"] + " " + s["Modal"]}>
          <h1 className={s["Modal-Title"]}>{t("HomePage.title")}</h1>
          <p className={s["Modal-Content"]}>{t("HomePage.subtitle")}</p>

          <label className={s["Modal-Label"]} htmlFor="input">{t("HomePage.inputLabel")}</label>
          <Input
            id="input"
            className={s["Modal-Input"]}
            onChange={e => setProjectName(e.target.value)}
          />

          <div className={s["Modal-Btns"]}>
            <Button
              className={s["Modal-Btn"]}
              onClick={handleCancel}
            >
              {t("HomePage.labelForReturnBtn")}
            </Button>

            <Button
              className={s["Modal-Btn"]}
              type="primary"
              onClick={handleOk}
            >
              {t("HomePage.labelForCreatNewModelBtn")}
            </Button>
          </div>
        </div>

        {contextHolder}
      </div>
    </Layout>
  )
}
