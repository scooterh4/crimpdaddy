import React from "react"
import ReactLoading from "react-loading"

function Loading() {
  return (
    <div
      style={{
        height: "100vh",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ReactLoading type="spin" color="#0000FF" height={200} width={100} />
    </div>
  )
}

export default Loading
