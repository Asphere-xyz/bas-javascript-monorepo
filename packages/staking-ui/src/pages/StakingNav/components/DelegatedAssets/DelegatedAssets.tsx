import { Table, Typography } from "antd";
import BigNumber from "bignumber.js";
import { observer } from "mobx-react";

import { useBasStore } from "../../../../stores";
import { useLocalGridStore } from "../../../../stores/LocalGridStore";

import { createTableColumns } from "./columns";
import { IDelegatedAssetsData } from "./interface";

const DelegatedAssets = observer(() => {
  const store = useBasStore()
  const grid = useLocalGridStore<IDelegatedAssetsData>(async (offset: number, limit: number): Promise<[IDelegatedAssetsData[], boolean]> => {
    const activeDelagations = await store.getBasSdk().getStaking().getMyActiveDelegations();
    const result: IDelegatedAssetsData[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const record of activeDelagations) {
      result.push({
        amount: new BigNumber(record.amount).dividedBy(10 ** 18).toFixed(),
        validator: record.validator,
        staker: record.staker,
        transactionHash: record.event?.transactionHash ?? '',
      });
    }
    
    return [result, false]
  });

  return (
    <>
      <Typography.Title>Delegated Assets</Typography.Title>
      <Table
        columns={createTableColumns(store)}
        dataSource={grid.items}
        loading={grid.isLoading}
        pagination={grid.paginationConfig}
      />
    </>
  );
});

export default DelegatedAssets;