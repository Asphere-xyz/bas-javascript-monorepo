/* eslint-disable no-await-in-loop */
import { IValidator, Web3Uint256 } from "@ankr.com/bas-javascript-sdk";
import { Table, Typography } from "antd";
import { observer } from "mobx-react";

import { useBasStore } from "../../../../stores";
import { useLocalGridStore } from "../../../../stores/LocalGridStore";

import { createTableColumns } from "./columns";

interface IHistoryData {
  type: string;
  amount: Web3Uint256;
  validator: string;
  status: string;
  datetime: string;
}

const StakingHistory = observer(() => {
  const store = useBasStore()
  const grid = useLocalGridStore<IHistoryData>(async (offset: number, limit: number): Promise<[IHistoryData[], boolean]> => {
    const delegationHistory = await store.getBasSdk().getStaking().getDelegationHistory();
    const undelegationHistory = await store.getBasSdk().getStaking().getUnDelegationHistory();

    const result: IHistoryData[] = []
    // eslint-disable-next-line no-restricted-syntax
    // for (const validator of delegationHistory) {
    //   result.push({ ...validator, myDelegatedAmount: await store.getBasSdk().getStaking().getMyDelegatedAmount(validator.validator),
    //     validatorFee: await store.getBasSdk().getStaking().getValidatorRewards(validator.validator),
    //     myStakingRewards: await store.getBasSdk().getStaking().getMyStakingRewards(validator.validator),
    //     key: validator.validator,
    //   });
    // }
    return [result, false]
  });

  return (
    <>
      <Typography.Title>History</Typography.Title>
      <Table
        columns={createTableColumns()}
        dataSource={[]}
        loading={false}
        pagination={grid.paginationConfig}
      />
    </>
  );
});

export default StakingHistory;