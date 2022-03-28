/* eslint-disable no-await-in-loop */
import { Web3Uint256, IValidator } from "@ankr.com/bas-javascript-sdk";
import { Table, Typography } from "antd";
import { observer } from "mobx-react";

import { useBasStore } from "../../../../stores";
import { useLocalGridStore } from "../../../../stores/LocalGridStore";

import { createTableColumns } from "./columns";

interface IValidatorWithAmounts extends IValidator {
  myDelegatedAmount: Web3Uint256;
  validatorFee: Web3Uint256;
  myStakingRewards: Web3Uint256;
  key: string;
}

const DelegatedAssets = observer(() => {
  const store = useBasStore()
  const grid = useLocalGridStore<IValidator>(async (offset: number, limit: number): Promise<[IValidatorWithAmounts[], boolean]> => {
    const validators = await store.getBasSdk().getStaking().getAllValidators();
      const result: IValidatorWithAmounts[] = []
    // eslint-disable-next-line no-restricted-syntax
    for (const validator of validators) {
      result.push({ ...validator, myDelegatedAmount: await store.getBasSdk().getStaking().getMyDelegatedAmount(validator.validator),
        validatorFee: await store.getBasSdk().getStaking().getValidatorRewards(validator.validator),
        myStakingRewards: await store.getBasSdk().getStaking().getMyStakingRewards(validator.validator),
        key: validator.validator,
      });
    }
    return [result, false]
  });

  return (
    <>
      <Typography.Title>Delegated Assets</Typography.Title>
      <Table
        columns={createTableColumns()}
        dataSource={[]}
        loading={false}
        pagination={grid.paginationConfig}
      />
    </>
  );
});

export default DelegatedAssets;