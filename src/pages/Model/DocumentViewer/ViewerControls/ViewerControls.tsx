import s from './ViewerControls.module.scss'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../reducers/rootReducers'


interface IProps {
  onPageChange(action: string): void
  currentPageNum: number
  setCurrentPageNum(nextPageNum: number): void
  numPages: number
}

export default function ViewerControls({ onPageChange, currentPageNum, setCurrentPageNum, numPages }: IProps) {
  const { t } = useTranslation()
  const [tempCurrentPageNum, setTempCurrentPageNum] = useState<string | number>(1)

  const activeFileIndex = useSelector((state: RootState) => state.model.activeFileIndex)

  const changePageNumber = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let nextPageNum: string | number = e.target.value
    setTempCurrentPageNum(e.target.value)

    nextPageNum = parseInt(nextPageNum)

    if (0 < nextPageNum && nextPageNum <= numPages) {
      setCurrentPageNum(nextPageNum)
    }
  }

  useEffect(() => {
    setTempCurrentPageNum(currentPageNum)
  }, [currentPageNum])

  useEffect(() => {
    activeFileIndex && setCurrentPageNum(1)
  }, [activeFileIndex])



  return (
    <div className={s["ViewerControls"]}>
      <LeftOutlined
        className={s["ViewerControls-Icon"]}
        onClick={() => onPageChange("decrease")}
      />

      <Input
        className={s["ViewerControls-Input"]}
        value={tempCurrentPageNum}
        max={numPages}
        min={1}
        onChange={e => changePageNumber(e)}
      />

      <div className={s["ViewerControls-Label"]}>
        {t("ModelPage.documentViewerSection.controlsLabel")} {numPages}
      </div>

      <RightOutlined
        className={s["ViewerControls-Icon"]}
        onClick={() => onPageChange("increase")}
      />
    </div>
  )
}