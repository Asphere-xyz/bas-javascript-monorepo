import { IGovernanceProposal } from "@ankr.com/bas-javascript-sdk"
import { Descriptions } from "antd"

import { renderStatus } from "../ProposalTable/columns"

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

      <br/>

      <Descriptions
        bordered
        column={2}
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
