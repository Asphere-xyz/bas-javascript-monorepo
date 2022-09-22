import {IValidator} from "@ankr.com/bas-javascript-sdk";
import {Button, Tooltip, Typography} from "antd";
import {ColumnProps} from "antd/lib/table";
import {BigNumber} from "bignumber.js";
import {delegate, undelegate, releaseFromJail} from "src/utils/helpers";
import React from 'react';

import {BasStore} from "../../../../stores/BasStore";
import prettyTime from "pretty-time";

const {Text} = Typography;

export const createTableColumns = (store: BasStore): ColumnProps<any>[] => {

  const handleDelegateClick = async (validator: IValidator) => {
    await delegate(store, validator.validator);
  }

  const handleUndelegateClick = async (validator: IValidator) => {
    await undelegate(store, validator.validator);
  }

  const handleReleaseClick = async (validator: IValidator) => {
    const {blockNumber, blockTime, epochBlockInterval, nextEpochBlock, epoch} = await store.getChainConfig();
    if (epoch < Number(validator.jailedBefore)) {
      const remainingBlocks = (Number(validator.jailedBefore) - epoch) * epochBlockInterval + (nextEpochBlock - blockNumber);
      // console.log(remainingBlocks)
      const remainingTime = prettyTime(remainingBlocks * blockTime * 1000 * 1000 * 1000, 'm')
      return alert(`This validator can't be released right now, epoch ${validator.jailedBefore} is not reached. Current epoch is ${epoch}, you should wait for ${remainingTime}.`);
    }
    await releaseFromJail(store, validator.validator);
  }

  return [
    {
      title: 'Validator',
      dataIndex: 'validator',
      key: 'validator',
    },
    {
      title: 'Status',
      key: 'status',
      render: (validator: IValidator) => {
        switch (validator.status) {
          case '0':
            return <Text type="secondary">Not Found</Text>
          case '1':
            return <Text type="success">Active</Text>
          case '2':
            return <Text type="warning">Pending</Text>
          case '3':
            return <Text type="danger">Jailed (e. {validator.jailedBefore})</Text>
          default:
            return <Text type="secondary">Unknown (${validator.status})</Text>
        }
      }
    },
    {
      title: 'Slashes',
      dataIndex: 'slashesCount',
      key: 'slashesCount',
    },
    {
      title: 'Total Delegated (Power)',
      key: 'totalDelegated',
      render: (validator: IValidator) => `${(Number(validator.totalDelegated) / 1e18).toFixed(2)} (${validator.votingPower.toFixed(2)}%)`
    },
    {
      title: 'APR',
      key: 'apr',
      render: (value: IValidator) => {
        // console.log(value.totalRewards)
        // console.log(value.totalDelegated)
        const  blockReward = new BigNumber("2097792000000000000000")
        const  reward = new BigNumber(value.totalRewards).plus(blockReward)
        // const  reward = new BigNumber(value.totalRewards)
        // console.log(y)
        const apr = 365 * (100 * reward.dividedBy(value.totalDelegated).toNumber())
        let prettyApr = '';
        if (apr === 0) {
          prettyApr = `0%`
        } else if (apr.toFixed(3) === '0.000') {
          prettyApr = `>0%`
        } else {
          prettyApr = `${apr.toFixed(3)}%`
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
        const isJailed = validator.prettyStatus === 'JAILED';
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

            {isJailed && (
              <Button
                className="tableButton"
                type="default"
                onClick={async () => handleReleaseClick(validator)}
                danger
              >
                Release
              </Button>
            )}
          </>
        )
      }
    }
  ];
}
