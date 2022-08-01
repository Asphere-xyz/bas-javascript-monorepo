import { observer } from "mobx-react"

import Header from "../components/Header"

const IndexPage = observer(() => {
  return (
    <div
      style={{
        display: "flex",
        height: "auto",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <Header />
    </div>
  )
})

export default IndexPage
