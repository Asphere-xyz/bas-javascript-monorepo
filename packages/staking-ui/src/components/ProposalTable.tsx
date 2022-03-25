import {IGovernanceProposal, TProposalStatus} from "@ankr.com/bas-javascript-sdk";
import {Table, Descriptions, Tag} from "antd";
import {observer} from "mobx-react";
import {ReactElement} from "react";

import {useChilizStore} from "../stores";
// import {BasStore} from "../stores/BasStore";
import {useLocalGridStore} from "../stores/LocalGridStore";

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
  return <Tag key={status} color={colors[status.toString()] || 'grey'}>{status}</Tag>
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

const createTableColumns = () => {
  return [
    {
      title: 'Id',
      dataIndex: 'proposalId',
      key: 'proposalId',
      render: (value: string) => `${value.substr(0, 20)  }...`,
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
      render: (description: string) => description.length > 30 ? `${description.substr(0, 30)  }...` : description,
    },
    // {
    //   render: (event: IProposal) => {
    //     if (`${event.status}` === 'Active') {
    //       return (
    //         <Button.Group>
    //           <Button type={"primary"} onClick={async () => {
    //             const {transactionHash, receiptPromise} = await store.voteForProposal(event.proposalId),
    //               receipt = await receiptPromise
    //             console.log(transactionHash)
    //             console.log(receipt)
    //           }}>Vote For</Button>
    //           <Button onClick={async () => {
    //             const {transactionHash, receiptPromise} = await store.voteAgainstProposal(event.proposalId),
    //               receipt = await receiptPromise
    //             console.log(transactionHash)
    //             console.log(receipt)
    //           }}>Vote Against</Button>
    //         </Button.Group>
    //       )
    //     } else if (`${event.status}` === 'Succeeded' || `${event.status}` === 'Queued') {
    //       return (
    //         <Button.Group>
    //           <Button type={"primary"} onClick={async () => {
    //             const {transactionHash, receiptPromise} = await store.executeProposal(event),
    //               receipt = await receiptPromise
    //             console.log(transactionHash)
    //             console.log(receipt)
    //           }}>Execute</Button>
    //         </Button.Group>
    //       )
    //     }
    //     return;
    //   }
    // }
  ];
}

export interface IProposalTableProps {
}

const ProposalExplainer = ({event}: { event: IGovernanceProposal }) => {
  return (
    <div>
      <Descriptions
        bordered
        column={1}
        layout="horizontal"
        size="small"
        title={`Proposal: #${event.id}`}
      >
        <Descriptions.Item key="id" label="ID">{event.id}</Descriptions.Item>

        <Descriptions.Item key="status" label="Status">{renderStatus(event.status)}</Descriptions.Item>

        <Descriptions.Item key="governanceAddress" label="Governance Address">{event.proposer}</Descriptions.Item>

        <Descriptions.Item key="startBlock" label="Start Block">{event.startBlock}</Descriptions.Item>

        <Descriptions.Item key="endBlock" label="End Block">{event.endBlock}</Descriptions.Item>

        <Descriptions.Item key="proposer" label="Proposer Address">{event.proposer}</Descriptions.Item>

        <Descriptions.Item key="description" label="Description">{event.desc}</Descriptions.Item>
      </Descriptions>

      <br/>

      <Descriptions
        bordered
        column={2}
        layout="horizontal"
        size="small"
        title="Actions"
      >
        {event.targets.map((value, index) => (
          <Descriptions.Item key={value}
                             label={`${value} (${event.values[index]} wei)`}>{event.inputs[index]}</Descriptions.Item>
        ))}
      </Descriptions>

      <br/>
    </div>
  )
}

const ProposalTable = observer(() => {
  const store = useChilizStore()
  const grid = useLocalGridStore<IGovernanceProposal>(async (): Promise<[IGovernanceProposal[], boolean]> => {
    const proposals = await store.getBasSdk().getGovernance().getProposals({fromBlock: 'earliest', toBlock: 'latest'})
    return [proposals, false]
  })
  return (
    <Table
      columns={createTableColumns()} dataSource={grid.items} expandable={{
        expandedRowRender: (event: IGovernanceProposal) => {
          return <ProposalExplainer event={event}/>
        },
      }}
      loading={grid.isLoading}
      pagination={grid.paginationConfig}
      rowKey="proposalId"
    />
  );
});

export default ProposalTable
