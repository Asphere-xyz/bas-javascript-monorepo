import { Divider } from "antd";
import { observer } from "mobx-react";
import { Switch, Route } from "react-router-dom";
import HomePage from "src/pages/HomePage";
import Logo from "../public/JFINChain-logo.svg";
import CookieConsent from "react-cookie-consent";

import BlockInfo from "./BlockInfo";
import Conditions from "./Conditions";

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
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        cookieName="jfinstk"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={365}
      >
        <Conditions />
      </CookieConsent>
    </div>
  );
});

export default Header;
