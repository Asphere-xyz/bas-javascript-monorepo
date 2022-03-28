import { HomeOutlined } from "@ant-design/icons"
import { Menu } from "antd"
import { observer } from "mobx-react"
import { useState } from "react"
import { Link } from "react-router-dom"

import Header from "../components/Header"

const IndexPage = observer(() => {
  const [currentPage, setCurrentPage] = useState('home');

  return (<div style={{display: 'flex', height: '100%'}}>
    <div style={{width: '256px', height: '100%'}}>
      <Menu
        defaultSelectedKeys={['home']}
        inlineCollapsed={false}
        mode="inline"
        style={{
          height: '100%'
        }}
        theme="dark"
        onClick={({key}) => {
          setCurrentPage(key)
        }}
      >
        <Menu.Item key="home" icon={<HomeOutlined translate="yes"/>}>
          <Link to="/">
            Consensus
          </Link>
        </Menu.Item>
      </Menu>
    </div>

    <Header />
  </div>)
})

export default IndexPage
