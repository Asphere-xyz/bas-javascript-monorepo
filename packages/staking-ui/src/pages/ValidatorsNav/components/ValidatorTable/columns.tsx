import { IValidator } from "@ankr.com/bas-javascript-sdk";
import { Button, message, Typography } from "antd";
import prompt from "antd-prompt";
import { ColumnProps } from "antd/lib/table";
import BigNumber from "bignumber.js";

import {BasStore} from "../../../../stores/BasStore";

const { Text } = Typography;

export const createTableColumns = (store: BasStore): ColumnProps<any>[]  => {

  const handleDelegateClick = async (validator: IValidator) => {
    const amount = await prompt({
      title: 'Enter delegation amount (in ether): ',
      rules: [
        {
          required: true,
          message: "You must enter number of tokens"
        }
      ],
      modalProps: {
        width: '400px',
      }
    });

    if (!amount) return;
    const bigAmount = new BigNumber(amount).multipliedBy(10**18).toString(10)
    
    try {
      const result = await store.getBasSdk().getStaking().delegateTo(validator.validator, `${bigAmount}`);
      const receipt = await result.receipt;
      console.log(`Receipt: ${JSON.stringify(receipt, null, 2)}`);

      message.success('Delegating was done!');
    } catch {
      message.error('Delegating was failed...try again!');
    }
  }

  const handleUndelegateClick = async (validator: IValidator) => {
    const amount = await prompt({
      title: 'Enter undelegation amount (in ether): ',
      rules: [
        {
          required: true,
          message: "You must enter number of tokens"
        }
      ]
    })
    
    if (!amount) return;
    const bigAmount = new BigNumber(amount).multipliedBy(10**18).toString(10)

    try {
      const result = await store.getBasSdk().getStaking().undelegateFrom(validator.validator, `${bigAmount}`);
      
      const receipt = await result.receipt;
      console.log(`Receipt: ${JSON.stringify(receipt, null, 2)}`);

      message.success('Undelegating was done!');
    } catch (e) {
      console.log(e)
      message.error('Undelegating was failed...try again!')
    }
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
