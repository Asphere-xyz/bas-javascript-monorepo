import { IChainConfig, IChainParams } from "@ankr.com/bas-javascript-sdk";
import { CopyOutlined } from "@ant-design/icons";
import { Table } from "antd";
import { ColumnProps, ColumnsType } from "antd/lib/table";
import { observer } from "mobx-react";
import prettyTime from "pretty-time";
import { useCallback, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { getCurrentEnv, useBasStore } from "src/stores";

interface IStakingHistory {
  data: IMyTransactionHistory[] | undefined;
}

interface IStakingHistoryColumn {
  type: string;
  amount: number;
}

const StakingHistory = observer(({ data }: IStakingHistory) => {
  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */
  const store = useBasStore();
  const columns: ColumnProps<IStakingHistoryColumn>[] = [
    {
      title: "Type",
      render: (v: IMyTransactionHistory) => {
        const diffBlock =
          Number(v.event.blockNumber) - Number(store.chainInfo?.blockNumber);
        return (
          <>
            {v.type.toUpperCase()}{" "}
            {v.type === "undelegation" && diffBlock >= 0 && (
              <span style={{ color: "orange" }}>
                ({store?.chainInfo && store.chainInfo.nextEpochIn})
              </span>
            )}
          </>
        );
      },
    },
    {
      key: "amount",
      dataIndex: "amount",
      title: "Amount",
      render: (v: number) => (
        <>
          {v.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
    {
      key: "validatorMask",
      dataIndex: "validatorMask",
      title: "Validator",
      // responsive: ["sm"],
      render: (v) => (
        <div className="items-center column-validator">
          <img
            src={v.image}
            alt={v.name}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "1px solid red",
              marginRight: "0.5rem",
            }}
          />
          <div>
            <span>{v.name}</span>
            <CopyToClipboard text={v.validator}>
              <CopyOutlined
                className="copy-clipboard"
                style={{ paddingLeft: "5px" }}
              />
            </CopyToClipboard>
          </div>
        </div>
      ),
    },
    {
      key: "event",
      dataIndex: "event",
      title: "Block",
      render: (v) => {
        return (
          <a
            href={`https://exp.${
              getCurrentEnv() === "jfin" ? "" : "testnet."
            }jfinchain.com/block/${v.blockNumber}/transactions`}
            target="_blank"
            rel="noreferrer"
          >
            {v.blockNumber}
          </a>
        );
      },
    },
    {
      key: "event",
      dataIndex: "event",
      title: "Hash",
      render: (v) => {
        return (
          <a
            href={`https://exp.${
              getCurrentEnv() === "jfin" ? "" : "testnet."
            }jfinchain.com/tx/${v.transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {[v.transactionHash.slice(0, 5), v.transactionHash.slice(-5)].join(
              "...."
            )}
          </a>
        );
      },
    },
  ];
  /* -------------------------------------------------------------------------- */
  /*                                   Methods                                  */
  /* -------------------------------------------------------------------------- */
  // const fetchChain = async () => {
  //   const chain = await store.getChainConfig();
  //   setChainInfo(chain);
  // };
  // const inital = useCallback(() => {
  //   if (!store.isConnected) return;
  //   const chain = await store.getChainConfig();
  //   setChainInfo(chain);

  //   setInterval(async () => {
  //     const chain = await store.getChainConfig();
  //     setChainInfo(chain);
  //   }, 5000);
  // }, [store.isConnected]);

  /* -------------------------------------------------------------------------- */
  /*                                   Watches                                  */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                                    DOMS                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="staking-history-container">
      <Table
        columns={columns}
        loading={!data}
        dataSource={data}
        pagination={{ size: "small" }}
        scroll={{ x: true }}
      />
    </div>
  );
});

export default StakingHistory;
