import { IValidator } from "@ankr.com/bas-javascript-sdk";
import { LoadingOutlined, WarningOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import { FormEvent, useEffect, useState } from "react";
import JfinCoin from "src/components/JfinCoin/JfinCoin";
import { getCurrentEnv, useBasStore, useModalStore } from "src/stores";
import { message } from "antd";
import { GWEI } from "src/utils/const";
import BigNumber from "bignumber.js";

interface IUnStakingContent {
  validator: IValidator;
  amount?: number;
  onSuccess?: () => void;
}

const UnStakingContent = observer((props: IUnStakingContent) => {
  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */
  const store = useBasStore();
  const modalStore = useModalStore();
  const [stakedAmount, setStakedAmount] = useState<number>();
  const [unStakingAmount, setUnStakingAmount] = useState(props.amount || 0);
  const [error, setError] = useState<string>();

  /* -------------------------------------------------------------------------- */
  /*                                   Methods                                  */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);
    if (!unStakingAmount) return;
    if (unStakingAmount < 1) return setError("Un-Stake amount must be more 1");
    if (unStakingAmount > Number(stakedAmount))
      return setError(`Un-Stake amount must be lower than ${stakedAmount}`);

    modalStore.setIsLoading(true);
    const amount = new BigNumber(unStakingAmount)
      .multipliedBy(GWEI)
      .toString(10);

    try {
      const tx = await store
        .getBasSdk()
        .getStaking()
        .undelegateFrom(props.validator.validator, amount);
      await tx.receipt;

      if (props.onSuccess) props.onSuccess();
      modalStore.setIsLoading(false);
      modalStore.setVisible(false);
      message.success("Un-Staking was done!");
    } catch (err: any) {
      modalStore.setIsLoading(false);
      message.error(`Something went wrong ${err.message || ""}`);
    }
  };

  const inital = async () => {
    modalStore.setIsLoading(false);
    setStakedAmount(await store.getMyValidatorStaked(props.validator));
  };

  useEffect(() => {
    inital();
  }, [store.isConnected]);

  /* -------------------------------------------------------------------------- */
  /*                                    DOMS                                    */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="un-staking-content">
      <form onSubmit={handleSubmit}>
        <div className="items-center">
          <b>Un-Staking</b> <JfinCoin />
        </div>

        <div className="">
          <input
            className="staking-input"
            disabled={modalStore.isLoading}
            onChange={(e) => setUnStakingAmount(+e.target.value)}
            style={{ marginTop: "15px" }}
            type="number"
            value={unStakingAmount}
          />
          <div className="staking-sub-input justify-between ">
            <span className="wallet-warning">{error}</span>
            <span className="col-title">Your staked: {stakedAmount || 0}</span>
          </div>
        </div>

        <div className="warning-message">
          <WarningOutlined />
          After complete the transaction, your staking will be returned in the
          form of a staking reward within 1 Epoch (
          {getCurrentEnv() === "jfin" ? "1hr" : "10min"}).
        </div>

        <button
          className="button lg w-100 m-0 ghost mt-2"
          disabled={modalStore.isLoading}
          type="submit"
        >
          {modalStore.isLoading ? <LoadingOutlined spin /> : "Confirm"}
        </button>
      </form>
    </div>
  );
});

export default UnStakingContent;
