import { Spin } from "antd"

const loaderStyles = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}

export default function LoaderForSuspenseComponent() {

  return (
    <div style={loaderStyles}>
      <Spin tip="Loading" />
    </div>
  )
}