import {Table, Descriptions} from "antd";
import {observer} from "mobx-react";
import {useChilizStore} from "../stores";
import {BasStore, IDeployer} from "../stores/BasStore";
import {useLocalGridStore} from "../stores/LocalGridStore";

const createTableColumns = (store: BasStore) => {
  return [
    {
      title: 'Account',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: 'Transaction Hash',
      dataIndex: 'transactionHash',
      key: 'transactionHash',
    },
    {
      title: 'Total Power',
      dataIndex: 'totalPower',
      key: 'totalPower',
    },
  ]
}

export interface IDeployerTableProps {
}

const DeployerExpander = ({event}: { event: IDeployer }) => {
  return (
    <div>
      <Descriptions
        title={`Proposal: #${event.transactionHash}`}
        layout={'horizontal'}
        size={'small'}
        column={1}
        bordered
      >
        <Descriptions.Item key="contractAddress" label="Contract Address">{event.address}</Descriptions.Item>
        <Descriptions.Item key="blockHash" label="Block Hash">{event.blockHash}</Descriptions.Item>
        <Descriptions.Item key="blockNumber" label="Block Number">{event.blockNumber}</Descriptions.Item>
        <Descriptions.Item key="account" label="Account Address">{event.account}</Descriptions.Item>
        <Descriptions.Item key="transactionHash" label="Transaction Hash">{event.transactionHash}</Descriptions.Item>
      </Descriptions>
      <br/>
    </div>
  )
}

const DeployerTable = observer((props: IDeployerTableProps) => {
  const store = useChilizStore()
  const grid = useLocalGridStore<IDeployer>(async (offset: number, limit: number): Promise<[IDeployer[], boolean]> => {
    return [await store.getDeployers({fromBlock: 'earliest', toBlock: 'latest'}), false]
  })
  return (
    <Table
      loading={grid.isLoading}
      pagination={grid.paginationConfig}
      dataSource={grid.items}
      expandable={{
        expandedRowRender: (event: IDeployer) => {
          return <DeployerExpander event={event}/>
        },
      }}
      rowKey={'proposalId'}
      columns={createTableColumns(store)}
    />
  );
});

export default DeployerTable
