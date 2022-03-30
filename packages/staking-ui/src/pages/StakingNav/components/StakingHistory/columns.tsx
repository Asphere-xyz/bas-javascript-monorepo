import {ColumnProps} from "antd/lib/table";
import {IHistoryData} from "./interface";
import {EXPLORER_URL} from "../../../../utils/const";
import {BasStore} from "../../../../stores/BasStore";
import {Typography} from "antd";

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
        const url = store.config.explorerConfig!.blockUrl.replace('{block}', `${record.event?.blockNumber || 0}`)
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
        const url = store.config.explorerConfig!.txUrl.replace('{tx}', record.transactionHash)
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
