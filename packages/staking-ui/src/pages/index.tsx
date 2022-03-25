import {HomeOutlined} from "@ant-design/icons"
import {Menu, PageHeader} from "antd"
import {observer} from "mobx-react"
import {useState} from "react"
import {Link, Route, Switch, useHistory} from "react-router-dom"

import HomePage from "./HomePage"

interface IIndexPageProps {
}

const titles: Record<string, any> = {
  home: {
    title: 'Home Page',
    sub: ' ',
  },
}

const IndexPage = observer((props: IIndexPageProps) => {
  const [currentPage, setCurrentPage] = useState('home')
  const history = useHistory()
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

    <div style={{width: '100%', padding: '0 20px 0'}}>
      <PageHeader
        className="site-page-header"
        subTitle={titles[currentPage].sub || 'Unknown Page'}
        title={titles[currentPage].title || 'Unknown Page'}
        onBack={() => history.goBack()}
      />

      <Switch>
        <Route component={HomePage} path="/"/>
      </Switch>
    </div>
  </div>)
})

export default IndexPage
