import { useState, useEffect } from 'react'
import IWord from '../../../../models/Word'
import WordContainer from './WordContainer/WordContainer'

interface IProps {
  words: IWord[]
}

export default function WordsContainers({ words }: IProps) {
  const [controlBtnIsPressed, setControlBtnIsPressed] = useState<boolean>(false)
  const [selectedWordsIdArr, setSelectedWordsIdArr] = useState<string[]>([])

  const showAnnotationWindow = (wordId: string): void => {
    const wordIdIsAlreadyInArr = selectedWordsIdArr.find((selectedWordId: string) => selectedWordId === wordId)
    if (wordIdIsAlreadyInArr && controlBtnIsPressed) {
      removeWordIdFromArr(wordId)
      return
    }

    if (selectedWordsIdArr.length === 0 || controlBtnIsPressed) {
      addWordIdToArr(wordId)
    }
  }

  const addWordIdToArr = (wordId: string): void => {
    const updatedSelectedWordsIdArr = [...selectedWordsIdArr]
    updatedSelectedWordsIdArr.push(wordId)
    setSelectedWordsIdArr(updatedSelectedWordsIdArr)
  }

  const removeWordIdFromArr = (wordId: string): void => {
    let updatedSelectedWordsIdArr = [...selectedWordsIdArr]
    updatedSelectedWordsIdArr = updatedSelectedWordsIdArr.filter((selectedWordId: string) => selectedWordId !== wordId)
    setSelectedWordsIdArr(updatedSelectedWordsIdArr)
  }

  const clearSelectedWordsIdArr = () => {
    setSelectedWordsIdArr([])
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Control") {
      setControlBtnIsPressed(true)
    }
  }

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Control") {
      setControlBtnIsPressed(false)
    }
  }

  const wordIdindexIsFirstIndexInSelectedWordsIdArr = (wordId: string): boolean => {
    const wordIdExistInSelectedWordsIdArr = selectedWordsIdArr.findIndex((selectedWordId: string) => selectedWordId === wordId)
    return wordIdExistInSelectedWordsIdArr === 0 ? true : false
  }

  const wordIdExistInSelectedWordsIdArr = (wordId: string): boolean => {
    const wordIdExistInSelectedWordsIdArr = selectedWordsIdArr.findIndex((selectedWordId: string) => selectedWordId === wordId)
    return wordIdExistInSelectedWordsIdArr !== -1 ? true : false
  }

  useEffect(() => {
    document.addEventListener("keydown", e => onKeyDown(e))
    document.addEventListener("keyup", e => onKeyUp(e))
  })

  return (
    <div>
      {words && words.length > 0 && words.map((word: IWord, index: number) => {
        return (
          <WordContainer
            key={index}
            wordContainerPoligon={
              {
                left: word.polygon[0].x,
                right: word.polygon[1].x,
                top: word.polygon[0].y,
                bottom: word.polygon[2].y
              }
            }
            wordId={word.idWord}
            showAnnotationWindow={showAnnotationWindow}
            wordIdExistInSelectedWordsIdArr={wordIdExistInSelectedWordsIdArr}
            clearSelectedWordsIdArr={clearSelectedWordsIdArr}
            selectedWordsIdArr={selectedWordsIdArr}
            controlBtnIsPressed={controlBtnIsPressed}
            wordIdindexIsFirstIndexInSelectedWordsIdArr={wordIdindexIsFirstIndexInSelectedWordsIdArr}
          />
        )
      })}
    </div>
  )
}