import { ColumnProps } from "antd/lib/table";
// import { EXPLORER_URL } from "src/utils/const";

// import { IHistoryData } from "./interface";

// const { Link } = Typography;

export const createTableColumns = (): ColumnProps<any>[]  => {
  return [
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
    // {
    //   title: 'Action',
    //   render: (record: IHistoryData) => {
    //     const url = `${EXPLORER_URL}${record.transactionHash}`
    //     return (
    //       <Link href="https://ant.design" target="_blank">
    //         {record.transactionHash}
    //       </Link>
    //     )
    //   }
    // }
  ];
}
