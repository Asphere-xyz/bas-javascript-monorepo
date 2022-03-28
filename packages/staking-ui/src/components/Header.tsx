import { Divider } from "antd";
import { observer } from "mobx-react";
import { Switch, Route } from "react-router-dom";
import HomePage from "src/pages/HomePage";

import BlockInfo from "./BlockInfo";

const Header = observer(() => {
  return (
    <div style={{width: '100%', padding: '0 20px 0'}}>
      <BlockInfo />
      <Divider />
      <Switch>
        <Route component={HomePage} path="/"/>
      </Switch>
    </div>
  )
});

export default Header;