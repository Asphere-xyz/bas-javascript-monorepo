import {IEventData} from "@ankr.com/bas-javascript-sdk";
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
    const myAddress = store.getBasSdk().getKeyProvider().getMyAddress()
    const history = await store.getBasSdk().getStaking().getAllEventsHistory({staker: myAddress});
    const result: IHistoryData[] = [];
    
    // eslint-disable-next-line no-restricted-syntax
    for (const record of history) {
      let type = 'undefined';
      let amount = '0';
      let validator;
      let staker;
      let transactionHash;
      let event: IEventData | undefined;
      if ('delegation' in record) {
        type = 'Delegation';
        amount = new BigNumber(record.delegation?.amount ?? '0').dividedBy(10 ** 18).toFixed();
        validator = record.delegation?.validator;
        staker = record.delegation?.staker;
        transactionHash = record.delegation?.event?.transactionHash;
        event = record.delegation?.event
      }
      if ('undelegation' in record) {
        type = 'Undelegation';
        amount = new BigNumber(record.undelegation?.amount ?? '0').dividedBy(10 ** 18).toFixed();
        validator = record.undelegation?.validator;
        staker = record.undelegation?.staker;
        transactionHash = record.undelegation?.event?.transactionHash;
        event = record.undelegation?.event
      }
      if ('claim' in record) {
        type = 'Claim';
        amount = new BigNumber(record.claim?.amount ?? '0').dividedBy(10 ** 18).toFixed();
        validator = record.claim?.validator;
        staker = record.claim?.staker;
        transactionHash = record.claim?.event?.transactionHash;
        event = record.claim?.event
      }

      result.push({
        type,
        amount,
        validator: validator ?? '',
        staker: staker ?? '',
        transactionHash: transactionHash ?? '',
        event,
      });
    }
    return [result, false]
  });

  return (
    <>
      <Typography.Title>History</Typography.Title>
      <Table
        columns={createTableColumns(store)}
        dataSource={grid.items}
        loading={grid.isLoading}
        pagination={grid.paginationConfig}
      />
    </>
  );
});

export default StakingHistory;