import { IValidator, Staking } from "@ankr.com/bas-javascript-sdk";
import {
  LoadingOutlined,
  MinusOutlined,
  PlusOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import BigNumber from "bignumber.js";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { getCurrentEnv, useBasStore, useModalStore } from "src/stores";
import { GWEI } from "src/utils/const";
import JfinCoin from "../JfinCoin/JfinCoin";
import AddStakingContent from "../Modal/content/AddStakingContent";
import ClaimStakingContent from "../Modal/content/ClaimStakingContent";
import UnStakingContent from "../Modal/content/UnStakingContent";
import "./ValidatorCollapseContent.css";

interface IValidatorCollapseContentProps {
  validator?: IValidator;
  refresh?: () => unknown;
}

const ValidatorCollapseContent = observer(
  ({ validator, refresh }: IValidatorCollapseContentProps) => {
    /* -------------------------------------------------------------------------- */
    /*                                   States                                   */
    /* -------------------------------------------------------------------------- */
    const store = useBasStore();
    const modalStore = useModalStore();
    const [stakingReward, setStakingReward] = useState((0).toFixed(3));
    const [stakingAmount, setStakingAmount] = useState((0).toFixed(3));
    const [isLoading, setIsLoading] = useState(false);

    /* -------------------------------------------------------------------------- */
    /*                                   Methods                                  */
    /* -------------------------------------------------------------------------- */

    const getReward = async (stakingProvider: Staking) => {
      if (!stakingProvider || !validator) return Number(0).toFixed(3);

      const reward = await stakingProvider?.getMyStakingRewards(
        validator.validator
      );

      return new BigNumber(reward).dividedBy(GWEI).toFixed(3);
    };

    const getMyStaking = async (stakingProvider: Staking) => {
      if (!stakingProvider || !validator) return (0).toFixed(3);

      const amount = await stakingProvider.getMyDelegatedAmount(
        validator.validator
      );
      return new BigNumber(amount).dividedBy(GWEI).toFixed(3);
    };

    const inital = async () => {
      const stakingProvider = await store.getBasSdk().getStaking();

      await setStakingReward(await getReward(stakingProvider));
      await setStakingAmount(await getMyStaking(stakingProvider));
    };

    const handleAdd = async () => {
      if (!validator) return;

      modalStore.setVisible(true);
      modalStore.setIsLoading(true);
      modalStore.setTitle("Add Staking");
      modalStore.setContent(
        <AddStakingContent
          onSuccess={refresh || inital}
          validator={validator}
        />
      );
      modalStore.setIsLoading(false);
    };

    const handleUnStaking = async () => {
      if (!validator) return;

      modalStore.setVisible(true);
      modalStore.setIsLoading(true);
      modalStore.setTitle("Un-Staking");
      modalStore.setContent(
        <UnStakingContent onSuccess={refresh || inital} validator={validator} />
      );
      modalStore.setIsLoading(false);
    };

    const handleCliam = async () => {
      if (!validator) return;
      modalStore.setVisible(true);
      modalStore.setIsLoading(true);
      modalStore.setTitle("Claim Reward");
      modalStore.setContent(
        <ClaimStakingContent
          amount={+stakingReward}
          onSuccess={refresh || inital}
          validator={validator}
        />
      );
      modalStore.setIsLoading(false);
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
      <div className="validator-collapse-content-container">
        <Row gutter={[24, 12]}>
          <Col className="info" lg={5} sm={24} xs={24}>
            <div className="validator-collapse-content-card borderless">
              <div>
                <div style={{ width: "100%" }}>
                  <div>
                    <span>Slasher: </span> {store.getSlasher(validator)}
                  </div>
                  <div>
                    <span>APR: </span>{" "}
                    {store
                      .getValidatorsApr(validator)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    %
                  </div>
                  <div>
                    <span>Comission Rate:</span>{" "}
                    {store.getCommisionrate(validator)}
                  </div>
                  <div>
                    <span>Total Stake: </span>
                    {store.getValidatorTotalStake(validator)}
                  </div>
                  <a
                    href={
                      validator
                        ? `https://exp.${
                            getCurrentEnv() === "jfin" ? "" : "testnet."
                          }jfinchain.com/address/${validator.validator}`
                        : "#"
                    }
                    rel="noreferrer"
                    style={{ width: "100%" }}
                    target="_blank"
                  >
                    Wallet Address
                    <WalletOutlined />
                  </a>
                </div>
              </div>
            </div>
          </Col>
          <Col className="reward" lg={9} sm={24} xs={24}>
            <div className="validator-collapse-content-card">
              <span className="col-title">Staking Reward</span>
              <div>
                <div className="value">
                  {Number(stakingReward).toLocaleString(undefined, {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })}{" "}
                  <JfinCoin />
                </div>
                <button
                  className="button secondary lg"
                  disabled={!store.walletAccount}
                  onClick={handleCliam}
                  type="button"
                >
                  {isLoading ? <LoadingOutlined spin /> : "Claim"}
                </button>
              </div>
            </div>
          </Col>
          <Col className="staking" lg={10} sm={24} xs={24}>
            <div className="validator-collapse-content-card">
              <span className="col-title">Staked</span>
              <div>
                <div className="value">
                  {Number(stakingAmount).toLocaleString(undefined, {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })}{" "}
                  <JfinCoin />
                </div>
                <div>
                  <button
                    className="button secondary lg"
                    disabled={!store.walletAccount}
                    onClick={handleAdd}
                    type="button"
                  >
                    <PlusOutlined />
                  </button>
                  <button
                    className="button secondary lg"
                    disabled={!store.walletAccount}
                    onClick={handleUnStaking}
                    style={{ marginLeft: "10px" }}
                    type="button"
                  >
                    <MinusOutlined />
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
);

export default ValidatorCollapseContent;
