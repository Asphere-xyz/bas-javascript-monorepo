import {Table, Descriptions, Tag} from "antd";
import {observer} from "mobx-react";
import { ReactElement } from "react";
import {useChilizStore} from "../stores";
import {BasStore, EContractState, ISmartContract} from "../stores/BasStore";
import {useLocalGridStore} from "../stores/LocalGridStore";

const renderState = (state: EContractState): ReactElement => {
  const colors: Record<string, string> = {
    Enabled: 'green',
    Disabled: 'red',
  };
  return <Tag color={colors[state.toString()] || 'grey'} key={state}>{state}</Tag>
};

const createTableColumns = (store: BasStore) => {
  return [
    {
      title: 'Address',
      dataIndex: 'impl',
      key: 'impl',
    },
    {
      title: 'Deployer',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      render: renderState
    },
    {
      title: 'Block Number',
      dataIndex: 'blockNumber',
      key: 'blockNumber',
    },
  ]
}

export interface ISmartContractTableProps {
}

const SmartContractExpander = ({event}: { event: ISmartContract }) => {
  return (
    <div>
      <Descriptions
        title={`Proposal: #${event.transactionHash}`}
        layout={'horizontal'}
        size={'small'}
        column={1}
        bordered
      >
        <Descriptions.Item key="impl" label="Deployed Contract Address">{event.impl}</Descriptions.Item>
        <Descriptions.Item key="account" label="Deployer Address">{event.account}</Descriptions.Item>
        <Descriptions.Item key="contractAddress" label="Contract Address">{event.address}</Descriptions.Item>
        <Descriptions.Item key="blockHash" label="Block Hash">{event.blockHash}</Descriptions.Item>
        <Descriptions.Item key="blockNumber" label="Block Number">{event.blockNumber}</Descriptions.Item>
        <Descriptions.Item key="transactionHash" label="Transaction Hash">{event.transactionHash}</Descriptions.Item>
        <Descriptions.Item key="state" label="Contract State">{event.state}</Descriptions.Item>
      </Descriptions>
      <br/>
    </div>
  )
}

const SmartContractTable = observer((props: ISmartContractTableProps) => {
  const store = useChilizStore()
  const grid = useLocalGridStore<ISmartContract>(async (offset: number, limit: number): Promise<[ISmartContract[], boolean]> => {
    return [await store.getSmartContracts({fromBlock: 'earliest', toBlock: 'latest'}), false]
  })
  return (
    <Table
      loading={grid.isLoading}
      pagination={grid.paginationConfig}
      dataSource={grid.items}
      expandable={{
        expandedRowRender: (event: ISmartContract) => {
          return <SmartContractExpander event={event}/>
        },
      }}
      rowKey={'proposalId'}
      columns={createTableColumns(store)}
    />
  );
});

export default SmartContractTable
