import { Typography } from "antd";
import { ColumnProps } from "antd/lib/table";

const { Link } = Typography;

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
      title: 'Validator name',
      dataIndex: 'validator',
      key: 'validator',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Datetime',
      dataIndex: 'datetime',
      key: 'datetime',
    },
    {
      title: 'Action',
      render: () => {
        return (
          <Link href="https://ant.design" target="_blank">
            test link
          </Link>
        )
      }
    }
  ];
}
