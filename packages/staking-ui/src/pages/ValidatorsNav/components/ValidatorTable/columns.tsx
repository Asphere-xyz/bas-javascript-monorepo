import {IValidator} from "@ankr.com/bas-javascript-sdk";
import {Button, Tooltip, Typography} from "antd";
import {ColumnProps} from "antd/lib/table";
import {BigNumber} from "bignumber.js";
import {delegate, undelegate} from "src/utils/helpers";
import React from 'react';

import {BasStore} from "../../../../stores/BasStore";

const {Text} = Typography;

export const createTableColumns = (store: BasStore): ColumnProps<any>[] => {

  const handleDelegateClick = async (validator: IValidator) => {
    await delegate(store, validator.validator);
  }

  const handleUndelegateClick = async (validator: IValidator) => {
    await undelegate(store, validator.validator);
  }

  return [
    {
      title: 'Validator',
      dataIndex: 'validator',
      key: 'validator',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        switch (status) {
          case '0':
            return <Text type="secondary">Not Found</Text>
          case '1':
            return <Text type="success">Active</Text>
          case '2':
            return <Text type="warning">Pending</Text>
          case '3':
            return <Text type="danger">Jail</Text>
          default:
            return <Text type="secondary">Unknown (${status})</Text>
        }
      }
    },
    {
      title: 'Slashes',
      dataIndex: 'slashesCount',
      key: 'slashesCount',
    },
    {
      title: 'Total Delegated',
      dataIndex: 'totalDelegated',
      key: 'totalDelegated',
      render: (value: string) => (Number(value) / 1e18).toFixed(2)
    },
    {
      title: 'Commission',
      dataIndex: 'commissionRate',
      key: 'commissionRate',
      render: (value: string) => `${(Number(value) / 1e2).toFixed(0)}%`
    },
    {
      title: 'APR',
      key: 'apr',
      render: (value: IValidator) => {
        const apr = 365 * (100 * new BigNumber(value.totalRewards).dividedBy(value.totalDelegated).toNumber())
        console.log(`Validator APR (${value.validator}): ${apr}`);
        let prettyApr = '';
        if (apr === 0) {
          prettyApr = `0%`
        } else if (apr.toFixed(2) === '0.00') {
          prettyApr = `~0%`
        } else {
          prettyApr = `${apr.toFixed(2)}%`
        }
        const MyComponent = React.forwardRef((props, ref) => {
          return <div>{prettyApr}</div>
        });
        return (
          <Tooltip placement="left" title={apr}>
            <MyComponent/>
          </Tooltip>
        )
      }
    },
    {
      render: (validator: IValidator) => {
        return (
          <>
            <Button
              className="tableButton"
              type="primary"
              onClick={async () => handleDelegateClick(validator)}
            >
              Delegate
            </Button>

            <Button
              className="tableButton"
              type="default"
              onClick={async () => handleUndelegateClick(validator)}
            >
              Undelegate
            </Button>
          </>
        )
      }
    }
  ];
}
