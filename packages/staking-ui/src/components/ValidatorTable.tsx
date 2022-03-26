/* eslint-disable no-await-in-loop */
import {Web3Uint256, IValidator} from "@ankr.com/bas-javascript-sdk";
import {Button, Table} from "antd";
import {BigNumber} from "bignumber.js"
import {observer} from "mobx-react";

import {useBasStore} from "../stores";
import {BasStore} from "../stores/BasStore";
import {useLocalGridStore} from "../stores/LocalGridStore";

const createTableColumns = (store: BasStore) => {
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
            return 'Not Found'
          case '1':
            return 'Active'
          case '2':
            return 'Pending'
          case '3':
            return 'Jail'
          default:
            return `Unknown (${status})`;
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
            <Button type="primary" onClick={async () => {
              const amount = prompt('Enter delegation amount (in ether): ')
              if (!amount) return;
              const bigAmount = new BigNumber(amount).multipliedBy(10**18).toString(10)
              console.log(`Amount is: ${bigAmount}`)
              const result = await store.getBasSdk().getStaking().delegateTo(validator.validator, `${bigAmount}`);
                const receipt = await result.receipt;
              console.log(`Receipt: ${JSON.stringify(receipt, null, 2)}`);
            }}>Delegate</Button>
            &nbsp;
            &nbsp;
            <Button type="default" onClick={async () => {
              const amount = prompt('Enter undelegation amount (in ether): ')
              if (!amount) return;
              console.log(`Amount is: ${(Number(amount) * 10 ** 18).toFixed(0)}`)
              const result = await store.getBasSdk().getStaking().undelegateFrom(validator.validator, `${(Number(amount) * 10 ** 18).toFixed(0)}`);
                const receipt = await result.receipt;
              console.log(`Receipt: ${JSON.stringify(receipt, null, 2)}`);
            }}>Undelegate</Button>
          </>
        )
      }
    }
  ];
}

export interface IValidatorTableProps {
}

interface IValidatorWithAmounts extends IValidator {
  myDelegatedAmount: Web3Uint256;
  validatorFee: Web3Uint256;
  myStakingRewards: Web3Uint256;
}

const ValidatorTableProps = observer((props: IValidatorTableProps) => {
  const store = useBasStore()
  const grid = useLocalGridStore<IValidator>(async (offset: number, limit: number): Promise<[IValidatorWithAmounts[], boolean]> => {
    const validators = await store.getBasSdk().getStaking().getActiveValidators();
      const result: IValidatorWithAmounts[] = []
    // eslint-disable-next-line no-restricted-syntax
    for (const validator of validators) {
      result.push({ ...validator, myDelegatedAmount: await store.getBasSdk().getStaking().getMyDelegatedAmount(validator.validator),
        validatorFee: await store.getBasSdk().getStaking().getValidatorRewards(validator.validator),
        myStakingRewards: await store.getBasSdk().getStaking().getMyStakingRewards(validator.validator),});
    }
    return [result, false]
  })
  return (
    <Table
      columns={createTableColumns(store)}
      dataSource={grid.items}
      loading={grid.isLoading}
      pagination={grid.paginationConfig}
    />
  );
});

export default ValidatorTableProps
