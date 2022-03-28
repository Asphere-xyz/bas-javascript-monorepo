import { observer } from "mobx-react"

import Header from "../components/Header"

const IndexPage = observer(() => {

  return (
    <div style={{display: 'flex', height: '100%'}}>
      <Header />
    </div>
  )
})

export default IndexPage
