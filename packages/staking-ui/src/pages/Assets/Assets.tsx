import { ClockCircleOutlined, WalletOutlined } from "@ant-design/icons";
import "./Assets.css";
import MyValidators from "src/components/MyValidators/MyValidators";
import StakingHistory from "src/components/StakingHistory/StakingHistory";
import { useBasStore } from "src/stores";
import { useEffect, useState } from "react";
import { IValidator } from "@ankr.com/bas-javascript-sdk";
import { observer } from "mobx-react";

export interface IMyValidators {
  amount: number;
  event?: unknown;
  validatorProvider: IValidator;
  validator: string;
  staker: string;
  epoch: number;
}
const Assets = observer(() => {
  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */
  const store = useBasStore();
  const [myValidators, setMyValidators] = useState<IMyValidators[]>();
  const [stakingHistory, setStakingHistory] =
    useState<IMyTransactionHistory[]>();
  const [loading, setLoading] = useState(true);
  /* -------------------------------------------------------------------------- */
  /*                                   Methods                                  */
  /* -------------------------------------------------------------------------- */
  const inital = async () => {
    setLoading(true);
    setMyValidators(await store.getMyValidator());
    setStakingHistory(await store.getMyTransactionHistory());
    setLoading(false);
  };

  const handleRefresh = async () => {
    setLoading(true);
    inital();
    setLoading(false);
  };
  /* -------------------------------------------------------------------------- */
  /*                                   Watches                                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    inital();
  }, [store.walletAccount]);

  /* -------------------------------------------------------------------------- */
  /*                                    DOMS                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="assets-container">
      <div className="content-card">
        <div className="card-title">
          <b>
            <WalletOutlined /> <span>Your Staking</span>
          </b>
        </div>
        <div className="card-body">
          <MyValidators
            loading={loading}
            refresh={handleRefresh}
            validators={myValidators}
          />
        </div>
      </div>

      <div className="content-card mt-2">
        <div className="card-title">
          <b>
            <ClockCircleOutlined /> <span>History</span>
          </b>
        </div>
        <div className="card-body" id="view-point3">
          <StakingHistory data={stakingHistory} />
        </div>
      </div>
    </div>
  );
});

export default Assets;
