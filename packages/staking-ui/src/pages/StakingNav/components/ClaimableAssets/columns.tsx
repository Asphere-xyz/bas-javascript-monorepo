import { Button } from "antd";
import { ColumnProps } from "antd/lib/table";
import { BasStore } from "src/stores/BasStore";
import { undelegate, delegate } from "src/utils/helpers";

import { IDelegatedAssetsData } from "./interface";
import {BigNumber} from "bignumber.js";
import {IValidator} from "@ankr.com/bas-javascript-sdk";

export const createTableColumns = (store: BasStore): ColumnProps<any>[]  => {
  
  const handleClaimRewards = async (record: IDelegatedAssetsData) => {
    await undelegate(store, record.validator);
  }
  
  return [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (value: BigNumber) => {
        return value.toString(10)
      }
    },
    {
      title: 'Validator',
      dataIndex: 'validator',
      key: 'validator',
      render: (value: IValidator) => {
        return value.validator
      }
    },
    {
      title: 'Action',
      render: (record: IDelegatedAssetsData) => {
        return (
          <div className="flexSpaceAround">
            <Button
              style={{ width: '40%' }}
              type="primary" 
              onClick={async () => handleClaimRewards(record)}
            >
              Claim
            </Button>
          </div>
        )
      }
    }
  ];
}
