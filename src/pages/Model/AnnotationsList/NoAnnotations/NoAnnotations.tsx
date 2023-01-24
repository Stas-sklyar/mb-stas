import { useTranslation } from 'react-i18next'
import s from './NoAnnotations.module.scss'

export default function NoAnnotations() {
  const { t } = useTranslation()

  return (
    <div className={s["NoAnnotations"]}>
      <svg className={s["NoAnnotations-Icon"]} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#F2F0FF" />
        <path d="M24 14.25V16.75M24 30V34M17.75 24H14.25M33.25 24H31.75M30.4571 30.4571L29.75 29.75M30.6642 17.4158L29.25 18.83M16.9216 31.0784L19.75 28.25M17.1287 17.2087L19.25 19.33" stroke="#9482FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className={s["NoAnnotations-Title"]}>
        {t("ModelPage.annotationsListSection.noAnnotationsTitle")}
      </div>

      <div className={s["NoAnnotations-Subtitle"]}>
        {t("ModelPage.annotationsListSection.noAnnotationsSubtitle")}
      </div>
    </div>
  )
}