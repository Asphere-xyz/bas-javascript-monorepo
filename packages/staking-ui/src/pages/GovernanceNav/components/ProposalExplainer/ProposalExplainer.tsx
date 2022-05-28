import {IGovernanceProposal, IGovernanceVote} from "@ankr.com/bas-javascript-sdk"
import {Descriptions, Divider, Table} from "antd"

import {renderStatus} from "../ProposalTable/columns"
import {BigNumber} from "bignumber.js";

export const ProposalExplainer = ({event}: { event: IGovernanceProposal }): JSX.Element => {
  return (
    <div>
      <Descriptions
        bordered
        column={1}
        layout="horizontal"
        size="small"
        title={`Proposal: #${event.id}`}
      >
        <Descriptions.Item
          key="id"
          label="ID"
        >
          {event.id}
        </Descriptions.Item>

        <Descriptions.Item
          key="status"
          label="Status"
        >
          {renderStatus(event.status)}
        </Descriptions.Item>

        <Descriptions.Item
          key="proposer"
          label="Proposer Address"
        >
          {event.proposer}
        </Descriptions.Item>

        <Descriptions.Item
          key="startBlock"
          label="Start Block"
        >
          {event.startBlock}
        </Descriptions.Item>

        <Descriptions.Item
          key="endBlock"
          label="End Block"
        >
          {event.endBlock}
        </Descriptions.Item>

        <Descriptions.Item
          key="description"
          label="Description"
        >
          {event.desc}
        </Descriptions.Item>
      </Descriptions>

      <Divider/>

      <h3><b>Voters</b></h3>
      <Table columns={[
        { title: 'Voter', dataIndex: 'voterAddress' },
        { title: 'Type', dataIndex: 'type' },
        { title: 'Block', dataIndex: 'blockNumber' },
        { title: 'Weight', dataIndex: 'weight', render: (value: BigNumber) => value.toString(10) },
      ]} dataSource={event.votes}/>

      <Divider/>

      <Descriptions
        bordered
        column={1}
        layout="horizontal"
        size="small"
        title="Actions"
      >
        {event.targets.map((value: any, index: number) => (
          <Descriptions.Item
            key={value}
            label={`${value} (${event.values[index]} wei)`}
          >
            {event.inputs[index]}
          </Descriptions.Item>
        ))}
      </Descriptions>

      <br/>
    </div>
  )
}
