import { Typography } from "antd";
import { ColumnProps } from "antd/lib/table";

import { BasStore } from "../../../../stores/BasStore";

import { IHistoryData } from "./interface";

const {Link} = Typography;

export const createTableColumns = (store: BasStore): ColumnProps<any>[] => {
  const columns: any[] = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Validator',
      dataIndex: 'validator',
      key: 'validator',
    },
  ];
  if (store.config.explorerConfig) {
    columns.push({
      title: 'Block',
      render: (record: IHistoryData) => {
        const url = store.config.explorerConfig?.blockUrl.replace('{block}', `${record.event?.blockNumber || 0}`)
        return (
          <Link href={url} target="_blank">
            {record.event?.blockNumber || 0}
          </Link>
        )
      }
    })
    columns.push({
      title: 'Transaction Hash',
      render: (record: IHistoryData) => {
        const url = store.config.explorerConfig?.txUrl.replace('{tx}', record.transactionHash)
        return (
          <Link href={url} target="_blank">
            {record.transactionHash.substring(0, 10)}...{record.transactionHash.substring(58)}
          </Link>
        )
      }
    })
  }
  return columns
}
