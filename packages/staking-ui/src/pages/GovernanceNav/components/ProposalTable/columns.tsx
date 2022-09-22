import {
  IGovernanceProposal,
  TGovernanceProposalStatus,
} from "@ankr.com/bas-javascript-sdk";
import { Button, Tag } from "antd";
import { ColumnProps } from "antd/lib/table";
import { ReactElement } from "react";

import { BasStore } from "../../../../stores/BasStore";
import { BigNumber } from "bignumber.js";

export const renderStatus = (
  status: TGovernanceProposalStatus
): ReactElement => {
  const colors: Record<string, string> = {
    Pending: "grey",
    Active: "blue",
    Canceled: "grey",
    Defeated: "orange",
    Succeeded: "blue",
    Queued: "yellow",
    Expired: "red",
    Executed: "green",
  };
  return (
    <Tag key={status} color={colors[status.toString()] || "grey"}>
      {status}
    </Tag>
  );
};

export const createTableColumns = (store: BasStore): ColumnProps<any>[] => {
  return [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (value: string) => `${value.substr(0, 20)}...`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: renderStatus,
    },
    {
      title: "Quorum Required",
      key: "quorumRequired",
      dataIndex: "quorumRequired",
      render: (value: BigNumber) => value.toFixed(0),
    },
    {
      title: "Voting Result",
      key: "blockNumber",
      render: (value: IGovernanceProposal) => {
        return (
          <div>
            <span style={{ color: "green", fontWeight: 500 }}>
              {value.voteDistribution.FOR.dividedBy(value.totalPower)
                .multipliedBy(100)
                .toFixed(2)}
              %
            </span>
            &nbsp; / &nbsp;
            <span style={{ color: "red", fontWeight: 500 }}>
              {value.voteDistribution.AGAINST.dividedBy(value.totalPower)
                .multipliedBy(100)
                .toFixed(2)}
              %
            </span>
          </div>
        );
      },
    },
    {
      title: "Voting Period",
      key: "votingPeriod",
      render: ({ startBlock, endBlock }: any) => {
        return `${startBlock} -> ${endBlock}`;
      },
    },
    {
      title: "Description",
      dataIndex: "desc",
      key: "desc",
      render: (description: string) =>
        description.length > 30
          ? `${description.substr(0, 30)}...`
          : description,
    },
    {
      render: (event: IGovernanceProposal) => {
        if (`${event.status}` === "Active") {
          return (
            <Button.Group>
              <Button
                type="primary"
                onClick={async () => {
                  const { transactionHash, receipt } = await store
                    .getBasSdk()
                    .getGovernance()
                    .voteForProposal(event.id);
                  console.log(transactionHash);
                  console.log(await receipt);
                }}
              >
                Vote For
              </Button>

              <Button
                onClick={async () => {
                  const { transactionHash, receipt } = await store
                    .getBasSdk()
                    .getGovernance()
                    .voteAgainstProposal(event.id);
                  console.log(transactionHash);
                  console.log(await receipt);
                }}
              >
                Vote Against
              </Button>
            </Button.Group>
          );
        }
        if (
          `${event.status}` === "Succeeded" ||
          `${event.status}` === "Queued"
        ) {
          return (
            <Button.Group>
              <Button
                type="primary"
                onClick={async () => {
                  const { transactionHash, receipt } = await store
                    .getBasSdk()
                    .getGovernance()
                    .executeProposal(event);
                }}
              >
                Execute
              </Button>
            </Button.Group>
          );
        }
      },
    },
  ];
};
