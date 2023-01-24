import { useTranslation } from "react-i18next"
import s from "./NoDocuments.module.scss"

export default function NoDocuments() {
  const { t } = useTranslation()

  return (
    <div className={s["NoDocuments"]}>
      <svg className={s["NoDocuments-Icon"]} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#F2F0FF" />
        <path d="M33 33L29.5001 29.5M32 23.5C32 28.1944 28.1944 32 23.5 32C18.8056 32 15 28.1944 15 23.5C15 18.8056 18.8056 15 23.5 15C28.1944 15 32 18.8056 32 23.5Z" stroke="#9482FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className={s["NoDocuments-Title"]}>
        {t("ModelPage.documentViewerSection.noDocumentsTitle")}
      </div>

      <div className={s["NoDocuments-Subtitle"]}>
        {t("ModelPage.documentViewerSection.noDocumentsSubtitle")}
      </div>
    </div>
  )
}
