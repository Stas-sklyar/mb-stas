import React from "react"
import WarningModal from "../WarningModal/WarningModal"

type IProps = {
  children: React.ReactNode
}

const mainElemStyles: React.CSSProperties = {
  position: "relative",
  height: "100vh",
  overflow: "hidden"
}

export default function Layout({ children }: IProps) {

  return (
    <>

      <main style={mainElemStyles}>
        {children}

        <WarningModal />
      </main>

    </>
  )
}