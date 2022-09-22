import { WarningOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import JfinCoin from "src/components/JfinCoin/JfinCoin";
import { getConfig, useBasStore } from "src/stores";
import { numberToHex } from "web3-utils";

const SwitchNetworkContent = observer(() => {
  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */
  const store = useBasStore();
  const [error, setError] = useState<string>();
  /* -------------------------------------------------------------------------- */
  /*                                   Methods                                  */
  /* -------------------------------------------------------------------------- */

  const handleSwitch = async () => {
    const { web3 } = await store.getBasSdk().getKeyProvider();

    try {
      await web3?.givenProvider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: numberToHex(getConfig().chainId),
            chainName: getConfig().chainName,
            rpcUrls: [getConfig().rpcUrl],
          },
        ],
      });
    } catch (addError) {
      try {
        await web3?.givenProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: numberToHex(getConfig().chainId) }],
        });
      } catch (switchError) {
        setError("Please add JFIN chain before switch the network.");
      }
    }
  };
  /* -------------------------------------------------------------------------- */
  /*                                   Watches                                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {}, [store.isConnected]);
  /* -------------------------------------------------------------------------- */
  /*                                    DOMS                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="add-staking-content">
      <div>Please switch to JFIN network before sending any transactions.</div>
      <div className="warning-message">
        <div>
          <WarningOutlined />
          If you haven added the JFIN network, please add the networt with below
          value.
          <hr />
          <div>
            <span className="cols-title">Network:</span>JFIN Chain
          </div>
          <div>
            <span className="cols-title">RPC URL:</span>
            https://rpc.jfinchain.com/
          </div>
          <div>
            <span className="cols-title">Chain ID:</span>
            3501
          </div>
          <div>
            <span className="cols-title">Symbol</span>
            JFIN
          </div>
          <div>
            <span className="cols-title">Explorer URL:</span>
            https://exp.jfinchain.com/
          </div>
        </div>
      </div>
      <div className="staking-sub-input m-0 mt-1" style={{ textAlign: "left" }}>
        <span className="wallet-warning">{error}</span>
      </div>
      <button
        className="button lg w-100 m-0 ghost mt-2"
        type="submit"
        onClick={handleSwitch}
      >
        Switch
      </button>
    </div>
  );
});

export default SwitchNetworkContent;
