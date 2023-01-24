import { useTranslation } from "react-i18next"

interface IProps {
  annotationType: number
}

export default function AnnotationTypeLabel({ annotationType }: IProps) {
  const { t } = useTranslation()
  
  return (
    <span>
      {
        annotationType === 10 &&
        <span>{t("ModelPage.annotationsTypes.text")}</span>
      }

      {
        annotationType === 11 &&
        <span>{t("ModelPage.annotationsTypes.email")}</span>
      }

      {
        annotationType === 12 &&
        <span>{t("ModelPage.annotationsTypes.address")}</span>
      }

      {
        annotationType === 40 &&
        <span>{t("ModelPage.annotationsTypes.digital")}</span>
      }

      {
        annotationType === 70 &&
        <span>{t("ModelPage.annotationsTypes.date")}</span>
      }

      {
        annotationType === 71 &&
        <span>{t("ModelPage.annotationsTypes.dateTime")}</span>
      }

      {
        annotationType === 72 &&
        <span>{t("ModelPage.annotationsTypes.time")}</span>
      }
    </span>
  )
}