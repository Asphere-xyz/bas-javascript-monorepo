import {Button, Table, Descriptions, Tag} from "antd";
import {observer} from "mobx-react";
import {useChilizStore} from "../stores";
import {BasStore} from "../stores/BasStore";
import {useLocalGridStore} from "../stores/LocalGridStore";
import {ReactElement} from "react";
import {TProposalStatus} from "@ankr.com/bas-javascript-sdk";

const renderStatus = (status: TProposalStatus): ReactElement => {
  const colors: Record<string, string> = {
    Pending: 'grey',
    Active: 'blue',
    Canceled: 'grey',
    Defeated: 'orange',
    Succeeded: 'blue',
    Queued: 'yellow',
    Expired: 'red',
    Executed: 'green'
  };
  return <Tag color={colors[status.toString()] || 'grey'} key={status}>{status}</Tag>
};

// const renderType = (type: EProposalType): ReactElement => {
//   const colors: Record<string, string> = {
//     Unknown: 'grey',
//     AddDeployer: 'blue',
//     RemoveDeployer: 'orange',
//     DisableContract: 'orange',
//     EnableContract: 'orange',
//   };
//   return <Tag color={colors[type.toString()] || 'grey'} key={type}>{type}</Tag>
// };

const createTableColumns = (store: BasStore) => {
  return [
    {
      title: 'Id',
      dataIndex: 'proposalId',
      key: 'proposalId',
      render: (value: string) => value.substr(0, 20) + '...',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: renderStatus,
    },
    {
      title: 'Type',
      key: 'type',
      // render: (event: IProposal) => {
      //   const firstType = store.matchProposalType(event.targets[0], event.calldatas[0])
      //   return renderType(firstType)
      // },
    },
    {
      title: 'Block Number',
      dataIndex: 'blockNumber',
      key: 'blockNumber',
    },
    {
      title: 'Voting Period',
      key: 'votingPeriod',
      render: ({startBlock, endBlock}: any) => {
        return `${startBlock} -> ${endBlock}`
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => description.length > 30 ? description.substr(0, 30) + '...' : description,
    },
    {
      render: (event: IProposal) => {
        if (`${event.status}` === 'Active') {
          return (
            <Button.Group>
              <Button type={"primary"} onClick={async () => {
                const {transactionHash, receiptPromise} = await store.voteForProposal(event.proposalId),
                  receipt = await receiptPromise
                console.log(transactionHash)
                console.log(receipt)
              }}>Vote For</Button>
              <Button onClick={async () => {
                const {transactionHash, receiptPromise} = await store.voteAgainstProposal(event.proposalId),
                  receipt = await receiptPromise
                console.log(transactionHash)
                console.log(receipt)
              }}>Vote Against</Button>
            </Button.Group>
          )
        } else if (`${event.status}` === 'Succeeded' || `${event.status}` === 'Queued') {
          return (
            <Button.Group>
              <Button type={"primary"} onClick={async () => {
                const {transactionHash, receiptPromise} = await store.executeProposal(event),
                  receipt = await receiptPromise
                console.log(transactionHash)
                console.log(receipt)
              }}>Execute</Button>
            </Button.Group>
          )
        }
        return;
      }
    }
  ];
}

export interface IProposalTableProps {
}

const ProposalExplainer = ({event}: { event: IProposal }) => {
  return (
    <div>
      <Descriptions
        title={`Proposal: #${event.proposalId}`}
        layout={'horizontal'}
        size={'small'}
        column={1}
        bordered
      >
        <Descriptions.Item key="id" label="ID">{event.proposalId}</Descriptions.Item>
        <Descriptions.Item key="status" label="Status">{renderStatus(event.status)}</Descriptions.Item>
        <Descriptions.Item key="governanceAddress" label="Governance Address">{event.address}</Descriptions.Item>
        <Descriptions.Item key="blockHash" label="Block Hash">{event.blockHash}</Descriptions.Item>
        <Descriptions.Item key="blockNumber" label="Block Number">{event.blockNumber}</Descriptions.Item>
        <Descriptions.Item key="startBlock" label="Start Block">{event.startBlock}</Descriptions.Item>
        <Descriptions.Item key="endBlock" label="End Block">{event.endBlock}</Descriptions.Item>
        <Descriptions.Item key="proposer" label="Proposer Address">{event.proposer}</Descriptions.Item>
        <Descriptions.Item key="transactionHash" label="Transaction Hash">{event.transactionHash}</Descriptions.Item>
        <Descriptions.Item key="description" label="Description">{event.description}</Descriptions.Item>
      </Descriptions>
      <br/>
      <Descriptions
        title={`Actions`}
        layout={'horizontal'}
        size={'small'}
        column={2}
        bordered
      >
        {event.targets.map((value, index) => (
          <Descriptions.Item key={value}
                             label={`${value} (${event.values[index]} wei)`}>{event.calldatas[index]}</Descriptions.Item>
        ))}
      </Descriptions>
      <br/>
    </div>
  )
}

const ProposalTable = observer((props: IProposalTableProps) => {
  const store = useChilizStore()
  const grid = useLocalGridStore<IProposal>(async (offset: number, limit: number): Promise<[IProposal[], boolean]> => {
    return [await store.getProposals({fromBlock: 'earliest', toBlock: 'latest'}), false]
  })
  return (
    <Table
      loading={grid.isLoading} pagination={grid.paginationConfig} dataSource={grid.items}
      expandable={{
        expandedRowRender: (event: IProposal) => {
          return <ProposalExplainer event={event}/>
        },
      }}
      rowKey={'proposalId'}
      columns={createTableColumns(store)}
    />
  );
});

export default ProposalTable
