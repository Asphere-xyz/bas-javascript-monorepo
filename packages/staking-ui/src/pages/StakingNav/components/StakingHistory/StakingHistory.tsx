import { Table, Typography } from "antd";
import BigNumber from "bignumber.js";
import { observer } from "mobx-react";

import { useBasStore } from "../../../../stores";
import { useLocalGridStore } from "../../../../stores/LocalGridStore";

import { createTableColumns } from "./columns";
import { IHistoryData } from "./interface";

const StakingHistory = observer(() => {
  const store = useBasStore()
  const grid = useLocalGridStore<IHistoryData>(async (offset: number, limit: number): Promise<[IHistoryData[], boolean]> => {
    const history = await store.getBasSdk().getStaking().getAllEventsHistory();
    const result: IHistoryData[] = [];
    
    // eslint-disable-next-line no-restricted-syntax
    for (const record of history) {
      let type = 'undefined';
      let amount = '0';
      let validator;
      let staker;
      let transactionHash;
      if ('delegation' in record) {
        type = 'Delegation';
        amount = new BigNumber(record.delegation?.amount ?? '0').dividedBy(10 ** 18).toFixed();
        validator = record.delegation?.validator;
        staker = record.delegation?.staker;
        transactionHash = record.delegation?.event?.transactionHash;
      }
      if ('undelegation' in record) {
        type = 'Undelegation';
        amount = new BigNumber(record.undelegation?.amount ?? '0').dividedBy(10 ** 18).toFixed();
        validator = record.undelegation?.validator;
        staker = record.undelegation?.staker;
        transactionHash = record.undelegation?.event?.transactionHash;
      }
      if ('claim' in record) {
        type = 'Claim';
        amount = new BigNumber(record.claim?.amount ?? '0').dividedBy(10 ** 18).toFixed();
        validator = record.claim?.validator;
        staker = record.claim?.staker;
        transactionHash = record.claim?.event?.transactionHash;
      }

      result.push({
        type,
        amount,
        validator: validator ?? '',
        staker: staker ?? '',
        transactionHash: transactionHash ?? '',
      });
    }
    return [result, false]
  });

  return (
    <>
      <Typography.Title>History</Typography.Title>
      <Table
        columns={createTableColumns()}
        dataSource={grid.items}
        loading={grid.isLoading}
        pagination={grid.paginationConfig}
      />
    </>
  );
});

export default StakingHistory;