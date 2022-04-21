import {IGovernanceProposal, TGovernanceProposalStatus} from "@ankr.com/bas-javascript-sdk";
import {Button, Tag} from "antd";
import {ColumnProps} from "antd/lib/table";
import {ReactElement} from "react";

import {BasStore} from "../../../../stores/BasStore";

export const renderStatus = (status: TGovernanceProposalStatus): ReactElement => {
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

export const createTableColumns = (store: BasStore): ColumnProps<any>[] => {
  return [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      render: (value: string) => `${value.substr(0, 20)}...`,
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
      dataIndex: 'desc',
      key: 'desc',
      render: (description: string) => description.length > 30 ? `${description.substr(0, 30)}...` : description,
    },
    {
      render: (event: IGovernanceProposal) => {
        if (`${event.status}` === 'Active') {
          return (
            <Button.Group>
              <Button
                type="primary"
                onClick={async () => {
                  const {transactionHash, receipt} = await store.getBasSdk().getGovernance().voteForProposal(event.id);
                  console.log(transactionHash);
                  console.log(await receipt);
                }}
              >
                Vote For
              </Button>

              <Button
                onClick={async () => {
                  const {
                    transactionHash,
                    receipt
                  } = await store.getBasSdk().getGovernance().voteAgainstProposal(event.id);
                  console.log(transactionHash);
                  console.log(await receipt);
                }}
              >
                Vote Against
              </Button>
            </Button.Group>
          )
        }
        if (`${event.status}` === 'Succeeded' || `${event.status}` === 'Queued') {
          return (
            <Button.Group>
              <Button type="primary" onClick={async () => {
                const {transactionHash, receipt} = await store.getBasSdk().getGovernance().executeProposal(event)
                console.log(transactionHash)
                console.log(await receipt)
              }}>Execute</Button>
            </Button.Group>
          )
        }
      }
    }
  ];
}
