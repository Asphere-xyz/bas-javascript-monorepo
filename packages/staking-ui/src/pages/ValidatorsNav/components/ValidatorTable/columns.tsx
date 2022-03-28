import { IValidator } from "@ankr.com/bas-javascript-sdk";
import { Button,  Typography } from "antd";
import { ColumnProps } from "antd/lib/table";
import { delegate, undelegate } from "src/utils/helpers";

import {BasStore} from "../../../../stores/BasStore";

const { Text } = Typography;

export const createTableColumns = (store: BasStore): ColumnProps<any>[]  => {

  const handleDelegateClick = async (validator: IValidator) => {
    await delegate(store, validator.validator);
  }

  const handleUndelegateClick = async (validator: IValidator) => {
    await undelegate(store, validator.validator);
  }

  return [
    {
      title: 'Validator',
      dataIndex: 'validator',
      key: 'validator',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        switch (status) {
          case '0':
            return <Text type="secondary">Not Found</Text>
          case '1':
            return <Text type="success">Active</Text>
          case '2':
            return <Text type="warning">Pending</Text>
          case '3':
            return <Text type="danger">Jail</Text>
          default:
            return <Text type="secondary">Unknown (${status})</Text>
        }
      }
    },
    {
      title: 'Slashes',
      dataIndex: 'slashesCount',
      key: 'slashesCount',
    },
    {
      title: 'Total Delegated',
      dataIndex: 'totalDelegated',
      key: 'totalDelegated',
      render: (value: string) => (Number(value) / 1e18).toFixed(0)
    },
    {
      title: 'Delegated Amount',
      dataIndex: 'myDelegatedAmount',
      key: 'myDelegatedAmount',
      render: (value: string) => (Number(value) / 1e18).toFixed(0)
    },
    {
      title: 'Validator Fee (committed)',
      dataIndex: 'validatorFee',
      key: 'validatorFee',
      render: (value: string) => (Number(value) / 1e18)
    },
    {
      render: (validator: IValidator) => {
        return (
          <>
            <Button
              className="tableButton" 
              type="primary" 
              onClick={async () => handleDelegateClick(validator)}
            >
              Delegate
            </Button>

            <Button
              className="tableButton" 
              type="default" 
              onClick={async () => handleUndelegateClick(validator)}
            >
              Undelegate
            </Button>
          </>
        )
      }
    }
  ];
}
