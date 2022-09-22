import { IValidator } from "@ankr.com/bas-javascript-sdk";
import { LoadingOutlined } from "@ant-design/icons";
import { message } from "antd";
import BigNumber from "bignumber.js";
import { observer } from "mobx-react";
import { FormEvent, useEffect, useState } from "react";
import JfinCoin from "src/components/JfinCoin/JfinCoin";
import { useBasStore, useModalStore } from "src/stores";
import { GWEI } from "src/utils/const";

interface IAddStakingContent {
  validator: IValidator;
  amount?: number;
  onSuccess?: () => void;
}
const AddStakingContent = observer((props: IAddStakingContent) => {
  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */
  const store = useBasStore();
  const modalStore = useModalStore();
  const [stakingAmount, setStakingAmount] = useState(props.amount || 0);
  const [error, setError] = useState<string>();

  /* -------------------------------------------------------------------------- */
  /*                                   Methods                                  */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);
    if (!stakingAmount) return;
    if (stakingAmount < 1) return setError("Stake amount must be more 1");
    if (stakingAmount > Number(store.walletBalance) / GWEI)
      return setError(
        `Stake amount must lower than ${store.getWalletBalance()}`
      );

    modalStore.setIsLoading(true);
    const amount = new BigNumber(stakingAmount).multipliedBy(GWEI).toString(10);

    try {
      const tx = await store
        .getBasSdk()
        .getStaking()
        .delegateTo(props.validator.validator, amount);
      await tx.receipt;

      if (props.onSuccess) props.onSuccess();
      modalStore.setIsLoading(false);
      modalStore.setVisible(false);
      message.success("Staking was done!");
    } catch (err: any) {
      modalStore.setIsLoading(false);
      message.error(`Something went wrong ${err.message || ""}`);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Watches                                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    modalStore.setIsLoading(false);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                    DOMS                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="add-staking-content">
      <form onSubmit={handleSubmit}>
        <div className="items-center">
          <b>Staking</b> <JfinCoin />
        </div>

        <div className="">
          <input
            className="staking-input"
            disabled={modalStore.isLoading}
            onChange={(e) => setStakingAmount(+e.target.value)}
            style={{ marginTop: "15px" }}
            type="number"
            value={stakingAmount}
          />
          <div className="staking-sub-input justify-between ">
            <span className="wallet-warning">{error}</span>
            <span className="col-title">
              Your balance: {store.getWalletBalance()}
            </span>
          </div>
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

export default AddStakingContent;
