import {IStakingRewards, IValidator} from "@ankr.com/bas-javascript-sdk";
import {Button} from "antd";
import {ColumnProps} from "antd/lib/table";
import {BigNumber} from "bignumber.js";
import {BasStore} from "src/stores/BasStore";
import {claimRewards} from "src/utils/helpers";

export const createTableColumns = (store: BasStore): ColumnProps<any>[] => {

  const handleClaimRewards = async (record: IStakingRewards) => {
    await claimRewards(store, record.validator.validator);
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
      render: (record: IStakingRewards) => {
        return (
          <div className="flexSpaceAround">
            <Button
              style={{width: '40%'}}
              type="primary"
              onClick={async () => handleClaimRewards(record)}
            >
              Claim&nbsp;&nbsp;&nbsp;
            </Button>
          </div>
        )
      }
    }
  ];
}
