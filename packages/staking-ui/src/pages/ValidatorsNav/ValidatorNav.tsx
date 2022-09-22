/* eslint-disable no-await-in-loop */
import { IValidator, Web3Uint256 } from "@ankr.com/bas-javascript-sdk";
import { observer } from "mobx-react";
import { ReactElement, useState, useEffect } from "react";
import ValidatorTable from "src/pages/ValidatorsNav/components/ValidatorTable/ValidatorTable";
import { useBasStore } from "src/stores";
import { useLocalGridStore } from "src/stores/LocalGridStore";

import "../index.css";

import { BondedTokensCard } from "./components/BondedTokensCard";
import { ValidatorsCard } from "./components/ValidatorsCard";
import { Button, Divider, Drawer } from "antd";
import CreateProposalForm from "../GovernanceNav/components/CreateProposalForm/CreateProposalForm";
import RegisterValidatorForm from "./components/RegisterValidatorForm/RegisterValidatorForm";
import { PlusOutlined } from "@ant-design/icons";

interface IValidatorWithAmounts extends IValidator {
  key: string;
}

export const ValidatorsNav = observer((): ReactElement => {
  const [activeValidators, setActiveValidators] = useState(0);
  const [totalValidators, setTotalValidators] = useState(0);
  const [bondedTokens, setBondedTokens] = useState("");
  const [registerValidatorVisible, setRegisterValidatorVisible] =
    useState(false);

  const store = useBasStore();
  const grid = useLocalGridStore<IValidator>(
    async (
      offset: number,
      limit: number
    ): Promise<[IValidatorWithAmounts[], boolean]> => {
      const validators = await store
        .getBasSdk()
        .getStaking()
        .getAllValidators();
      const totalDelegatedTokens = await store
        .getBasSdk()
        .getStaking()
        .getTotalDelegatedAmount();
      setBondedTokens(totalDelegatedTokens.toFixed());
      const result: IValidatorWithAmounts[] = [];

      const totalCount = validators.length;
      let activeCount = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const validator of validators) {
        if (validator.status === "1") activeCount += 1;
        result.push({
          ...validator,
          key: validator.validator,
        });
      }
      setTotalValidators(totalCount);
      setActiveValidators(activeCount);
      return [result, false];
    }
  );

  useEffect(() => {}, [store]);

  return (
    <div>
      <div className="validatorHeadWrapper">
        <ValidatorsCard
          active={activeValidators}
          loading={grid.isLoading}
          title="Validators"
          total={totalValidators}
        />

        <BondedTokensCard
          loading={grid.isLoading}
          title="Bonded Tokens"
          tokens={bondedTokens}
          tokenSymbol=""
        />
      </div>
      <br />

      <ValidatorTable gridData={grid} store={store} />
      <Divider />

      <br />
      <br />
      <br />
    </div>
  );
});
