import { useEffect, useState } from 'react'
import AddAnnotationWindow from '../../AddAnnotationWindow/AddAnnotationWindow'
import s from './WordContainer.module.scss'
import { message } from 'antd'
import { NoticeType } from 'antd/es/message/interface'

interface IWordContainerPoligon {
  left: number
  right: number
  top: number
  bottom: number
}

interface IProps {
  wordContainerPoligon: IWordContainerPoligon
  wordId: string
  showAnnotationWindow(wordId: string): void
  wordIdExistInSelectedWordsIdArr(wordId: string): boolean
  clearSelectedWordsIdArr(): void
  selectedWordsIdArr: string[]
  controlBtnIsPressed: boolean
  wordIdindexIsFirstIndexInSelectedWordsIdArr(wordId: string): boolean
}

export default function WordContainer({
  wordContainerPoligon,
  wordId,
  showAnnotationWindow,
  wordIdExistInSelectedWordsIdArr,
  clearSelectedWordsIdArr,
  selectedWordsIdArr,
  controlBtnIsPressed,
  wordIdindexIsFirstIndexInSelectedWordsIdArr
}: IProps) {
  const [messageApi, contextHolder] = message.useMessage()

  const [wordContainerWidth, setWordContainerWidth] = useState<number>(0)
  const [wordContainerHeight, setWordContainerHeight] = useState<number>(0)

  useEffect(() => {
    setWordContainerWidth(wordContainerPoligon.right - wordContainerPoligon.left)
    setWordContainerHeight(wordContainerPoligon.bottom - wordContainerPoligon.top)
  }, [wordContainerPoligon])

  const showAlert = (type: NoticeType | undefined, message: string): void => {
    messageApi.open({
      type: type,
      content: message
    })
  }

  return (
    <>
      <div
        className={
          (wordIdExistInSelectedWordsIdArr(wordId)
            ? s["WordContainer"] + " " + s["WordContainer-Selected"]
            : s["WordContainer"])
          + (controlBtnIsPressed ? " " + s["WordContainer-Highlighted"] : "")

        }
        style={{
          left: wordContainerPoligon.left,
          width: wordContainerWidth,
          top: wordContainerPoligon.top,
          height: wordContainerHeight
        }}
        onClick={() => showAnnotationWindow(wordId)}
      >
      </div>

      {
        wordIdindexIsFirstIndexInSelectedWordsIdArr(wordId) && !controlBtnIsPressed
          ? <AddAnnotationWindow
            left={wordContainerPoligon.left}
            top={wordContainerPoligon.top}
            width={wordContainerWidth}
            clearSelectedWordsIdArr={clearSelectedWordsIdArr}
            selectedWordsIdArr={selectedWordsIdArr}
            showAlert={showAlert}
          />
          : ""
      }

      {contextHolder}
    </>
  )
}