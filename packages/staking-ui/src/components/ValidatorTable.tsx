import {Button, Table} from "antd";
import {observer} from "mobx-react";
import {useChilizStore} from "../stores";
import {BasStore, IValidator} from "../stores/BasStore";
import {useLocalGridStore} from "../stores/LocalGridStore";
import {BigNumber} from "bignumber.js"

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
        }
        return `Unknown (${status})`
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
            <Button type={"primary"} onClick={async () => {
              const amount = prompt('Enter delegation amount (in ether): ')
              if (!amount) return;
              const bigAmount = new BigNumber(amount).multipliedBy(10**18).toString(10)
              console.log(`Amount is: ${bigAmount}`)
              const result = await store.delegateTo(validator.validator, `${bigAmount}`),
                receipt = await result.receiptPromise;
              console.log(`Receipt: ${JSON.stringify(receipt, null, 2)}`);
            }}>Delegate</Button>
            &nbsp;
            &nbsp;
            <Button type={"default"} onClick={async () => {
              const amount = prompt('Enter undelegation amount (in ether): ')
              if (!amount) return;
              console.log(`Amount is: ${(Number(amount) * 10 ** 18).toFixed(0)}`)
              const result = await store.undelegateFrom(validator.validator, `${(Number(amount) * 10 ** 18).toFixed(0)}`),
                receipt = await result.receiptPromise;
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

const ValidatorTableProps = observer((props: IValidatorTableProps) => {
  const store = useChilizStore()
  const grid = useLocalGridStore<IValidator>(async (offset: number, limit: number): Promise<[IValidator[], boolean]> => {
    const validators = await store.getActiveValidators()
    for (const validator of validators) {
      validator.myDelegatedAmount = await store.getMyDelegatedAmount(validator.validator)
      validator.validatorFee = await store.getValidatorRewards(validator.validator)
      validator.myStakingRewards = await store.getMyStakingRewards(validator.validator)
    }
    console.log(validators)
    return [validators, false]
  })
  return (
    <Table
      loading={grid.isLoading}
      pagination={grid.paginationConfig}
      dataSource={grid.items}
      columns={createTableColumns(store)}
    />
  );
});

export default ValidatorTableProps
