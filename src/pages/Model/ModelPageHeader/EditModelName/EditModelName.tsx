import { Col, Input, Row } from "antd"
import s from "./EditModelName.module.scss"
import { CheckOutlined } from "@ant-design/icons"
import { useState } from "react"

interface IProps {
  srcName: string
  onChangeAnnotationName(name: string): Promise<string>
}

export default function EditModelName({ srcName, onChangeAnnotationName }: IProps) {
  const [tempNewModelName, setTempNewModelName] = useState<string>("")
  const [updateModelNameInputIsActive, setUpdateModelNameInputIsActive] = useState<boolean>(false)
  const [modelNameHasBeenChanged, setModelNameHasBeenChanged] = useState<boolean>(false)
  const [updatedModelName, setUpdatedModelName] = useState<string>("")

  const startEditingModelName = () => {
    setUpdateModelNameInputIsActive(true)
    modelNameHasBeenChanged
      ? setTempNewModelName(updatedModelName)
      : setTempNewModelName(srcName)
  }

  const confirmAnnotationChange = (): void => {
    if (tempNewModelName === (modelNameHasBeenChanged ? updatedModelName : srcName)) {
      setTempNewModelName("")
      setUpdateModelNameInputIsActive(false)
      return
    }

    onChangeAnnotationName(tempNewModelName)
      .then((newAnnotationName: string) => {
        setModelNameHasBeenChanged(true)
        setUpdatedModelName(newAnnotationName)
      })
      .finally(() => {
        setTempNewModelName("")
        setUpdateModelNameInputIsActive(false)
      })
  }

  return (
    <Row align="middle">
      <Col>
        {!updateModelNameInputIsActive &&
          <h1 className={s["EditModelName-Name"]}>
            {modelNameHasBeenChanged ? updatedModelName : srcName}
          </h1>
        }

        {updateModelNameInputIsActive &&
          <Input
            autoFocus
            className={s["EditModelName-TextField"]}
            value={tempNewModelName}
            onChange={e => setTempNewModelName(e.target.value)}
          />
        }
      </Col>

      <Col>
        {!updateModelNameInputIsActive &&
          <svg
            className={s["EditModelName-EditIcon"]}
            onClick={() => startEditingModelName()}
            viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1.39668 15.0964C1.43497 14.7518 1.45411 14.5795 1.50624 14.4185C1.55249 14.2756 1.61784 14.1396 1.70051 14.0142C1.79369 13.8729 1.91627 13.7504 2.16142 13.5052L13.1667 2.49999C14.0871 1.57951 15.5795 1.57951 16.5 2.49999C17.4205 3.42046 17.4205 4.91285 16.5 5.83332L5.49475 16.8386C5.2496 17.0837 5.12702 17.2063 4.98572 17.2995C4.86035 17.3821 4.72439 17.4475 4.58152 17.4937C4.42048 17.5459 4.24819 17.565 3.90362 17.6033L1.08331 17.9167L1.39668 15.0964Z" stroke="#475467" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }

        {updateModelNameInputIsActive &&
          <CheckOutlined
            className={s["EditModelName-Icon"]}
            onClick={() => confirmAnnotationChange()}
          />
        }
      </Col>
    </Row>
  )
}
