import { Button } from "antd";
import { ColumnProps } from "antd/lib/table";

export const createTableColumns = (): ColumnProps<any>[]  => {
  
  const handleCancelDelegateClick = async () => {
    console.log('handleCancelDelegateClick');
  }

  const handleRepeatDelegateClick = async () => {
    console.log('handleRepeatDelegateClick');
  }

  
  return [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Validator name',
      dataIndex: 'validator',
      key: 'validator',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'The rate from',
      dataIndex: 'rateDatetime',
      key: 'rateDatetime',
    },
    {
      title: 'Action',
      render: () => {
        return (
          <>
            <Button
              className="tableButton" 
              type="primary" 
              onClick={async () => handleCancelDelegateClick()}
            >
              Cancel
            </Button>

            <Button
              className="tableButton" 
              type="default" 
              onClick={async () => handleRepeatDelegateClick()}
            >
              Repeat
            </Button>
          </>
        )
      }
    }
  ];
}
