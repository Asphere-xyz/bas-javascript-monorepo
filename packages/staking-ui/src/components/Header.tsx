import { Divider } from "antd";
import { observer } from "mobx-react";
import { Switch, Route } from "react-router-dom";
import HomePage from "src/pages/HomePage";
import Logo from "../public/JFINChain-logo.svg";

import BlockInfo from "./BlockInfo";

const Header = observer(() => {
  return (
    <div style={{ width: "100%" }}>
      <div className="main-page">
        <header className="header">
          <h1>
            <a href="https://jfinchain.com">
              <img src="../JFINChain-logo.svg" alt="" />
            </a>
          </h1>
          <nav>
            <a href="https://exp.testnet.jfinchain.com">Explorer</a>
            <a href="https://staking.testnet.jfinchain.com">Staking</a>
            <a href="https://faucet.testnet.jfinchain.com">Faucet</a>
          </nav>
        </header>

        <BlockInfo />
        <Divider />
        <Switch>
          <Route component={HomePage} path="/" />
        </Switch>
      </div>
    </div>
  );
});

export default Header;
