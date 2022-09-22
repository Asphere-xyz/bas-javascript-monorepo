import { Button, Divider, Dropdown, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/images/logo.svg";
import { useEffect, useState } from "react";
import {
  CloseOutlined,
  DownOutlined,
  MenuOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { getCurrentEnv, useBasStore } from "src/stores";
import { observer } from "mobx-react";
import { NavHashLink } from "react-router-hash-link";

const Navbar = observer(() => {
  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */
  const [isBurgerActive, setIsBurgerActive] = useState(false);
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [walletAccount, setWalletAccount] = useState<string>();
  const location = useLocation();
  const store = useBasStore();

  /* -------------------------------------------------------------------------- */
  /*                                   Methods                                  */
  /* -------------------------------------------------------------------------- */
  const handleConnectWallet = async () => {
    if (!store.walletAccount) {
      setIsWalletLoading(true);
      await store
        .connectFromInjected()
        .finally(() => setIsWalletLoading(false));
    }
  };

  const handleDapp = () => {
    if (store.walletAccount) return;
    window.location.replace(
      `https://metamask.app.link/dapp/${window.location.href}`
    );
  };

  const handleDisconnect = async () => {
    await store.disconnect();
  };

  const handleRoute = () => {
    setIsBurgerActive(false);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Watches                                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    setWalletAccount(store.getWalletAccount());
  }, [store.walletAccount]);

  /* -------------------------------------------------------------------------- */
  /*                                    DOMS                                    */
  /* -------------------------------------------------------------------------- */
  const WalletOverlay = (
    <div className="wallet-overlay">
      <a onClick={handleDisconnect} role="button" tabIndex={0}>
        Logout
      </a>
    </div>
  );

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-wrapper">
          <div className="navbar-brand">
            <a href="https://jfinchain.com">
              <img alt="jfinchain logo" src={logo} />
            </a>
          </div>

          <div className="navbar-menu">
            <Link
              className={`${
                ["/", "/staking"].includes(location.pathname) && "active"
              }`}
              to="/staking"
            >
              Staking
            </Link>
            <Link
              className={`${location.pathname === "/governance" && "active"}`}
              to="/governance"
            >
              Governance
            </Link>
            <Link
              className={`${location.pathname === "/assets" && "active"}`}
              to="/assets"
            >
              Assets
            </Link>
            <span>|</span>
            <a
              href={`https://exp.${
                getCurrentEnv() === "jfin" ? "" : "testnet."
              }jfinchain.com/`}
              rel="noreferrer"
              target="_blank"
            >
              Explorer
            </a>
            {getCurrentEnv() === "jfintest" && (
              <a
                href={`https://faucet.${
                  getCurrentEnv() === "jfin" ? "" : "testnet."
                }jfinchain.com/`}
                rel="noreferrer"
                target="_blank"
              >
                Faucet
              </a>
            )}
          </div>

          <div className="navbar-wallet">
            {walletAccount ? (
              <Dropdown overlay={WalletOverlay}>
                <Button type="primary">
                  <WalletOutlined /> {walletAccount} <DownOutlined />
                </Button>
              </Dropdown>
            ) : (
              <>
                <Button
                  loading={isWalletLoading}
                  onClick={handleConnectWallet}
                  type="primary"
                >
                  Connect Metamask
                </Button>
              </>
            )}
          </div>

          <div className={`navbar-burger ${isBurgerActive && "active"}`}>
            <button
              className="burger-button"
              onClick={() => setIsBurgerActive(!isBurgerActive)}
              type="button"
            >
              {isBurgerActive ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          </div>
        </div>
      </div>
      <div className={`navbar-overlay ${isBurgerActive && "active"}`}>
        <NavHashLink
          className={`${
            ["/", "/staking"].includes(location.pathname) && "active"
          }`}
          onClick={handleRoute}
          to="/staking#view-point1"
        >
          Staking
        </NavHashLink>
        <NavHashLink
          className={`${location.pathname === "/governance" && "active"}`}
          onClick={handleRoute}
          to="/governance#view-point2"
        >
          Governance
        </NavHashLink>
        <NavHashLink
          className={`${location.pathname === "/assets" && "active"}`}
          onClick={handleRoute}
          to="/assets#view-point3"
        >
          Assets
        </NavHashLink>
        <a
          href={`https://exp.${
            getCurrentEnv() === "jfin" ? "" : "testnet."
          }jfinchain.com/`}
          rel="noreferrer"
          target="_blank"
        >
          Explorer
        </a>
        {getCurrentEnv() === "jfintest" && (
          <a
            href={`https://faucet.${
              getCurrentEnv() === "jfin" ? "" : "testnet."
            }jfinchain.com/`}
            rel="noreferrer"
            target="_blank"
          >
            Faucet
          </a>
        )}
        <div style={{ paddingBottom: "1rem" }}>
          {/* <Button
            loading={isWalletLoading}
            onClick={handleConnectWallet}
            type="primary"
          >
            {walletAccount ? (
              <>
                <WalletOutlined /> {walletAccount}
              </>
            ) : (
              "Connect Metamask"
            )}
          </Button> */}
          <Button loading={isWalletLoading} onClick={handleDapp} type="primary">
            {walletAccount ? (
              <>
                <WalletOutlined /> {walletAccount}
              </>
            ) : (
              "Connect Metamask"
            )}
          </Button>
        </div>
      </div>
    </>
  );
});

export default Navbar;
