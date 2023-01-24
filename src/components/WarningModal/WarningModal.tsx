import { Button } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../reducers/rootReducers"
import { hideWarningModal } from "../../reducers/warningModalReducer"
import s from "./WarningModal.module.scss"
import { useTranslation } from "react-i18next"

export default function WarningModal() {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const modalIsOpen = useSelector((state: RootState) => state.warningModal.modalIsOpen)
  const content = useSelector((state: RootState) => state.warningModal.content)

  const closeModal = () => {
    dispatch(hideWarningModal())
  }

  const onClickModalWrapper = (e: any) => {
    if (e.target.id === "WarningModal") {
      closeModal()
    }
  }

  return (
    <div
      className={s["WarningModal"]}
      id="WarningModal"
      onClick={e => onClickModalWrapper(e)}
      style={{ display: modalIsOpen ? "flex" : "none" }}
    >
      <div className={s["WarningModal-Modal"] + " " + s["Modal"]}>
        <h1 className={s["Modal-Title"]}>
          {t("shared.warningModalTitle")}
        </h1>
        <p className={s["Modal-Content"]}>{content}</p>

        <div className={s["Modal-Btns"]}>
          <Button
            type="primary"
            onClick={() => closeModal()}
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  )
}