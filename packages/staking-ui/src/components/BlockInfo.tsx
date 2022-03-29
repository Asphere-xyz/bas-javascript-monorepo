import { RightOutlined, DownOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";
import {BigNumber} from "bignumber.js";
import { observer } from "mobx-react";
import { useCallback, useEffect, useState } from "react";
import { useBasStore } from "src/stores";

interface IBlockInfoData {
  blockNumber: number;
  epoch: number;
  nextEpochBlock: number;
  nextEpochInSec: number;
  blockTime: number;
  activeValidatorsLength: number;
  epochBlockInterval: number;
  misdemeanorThreshold: number;
  felonyThreshold: number;
  validatorJailEpochLength: number;
  undelegatePeriod: number;
  minValidatorStakeAmount: number;
  minStakingAmount: number;
}

const { Text } = Typography;

const BlockInfo = observer(() => {
  const store = useBasStore();
  
  const [showBlockInfo, setShowBlockInfo] = useState(true);
  const [blockInfo, setBlockInfo] = useState<IBlockInfoData | null>(null);
  useEffect(() => {
    setInterval(async () => {
      if (!store.isConnected) return;
      setBlockInfo(await store.getBlockNumber());
    })
  }, [store]);

  const handleShowDataClick = useCallback(() => {
    setShowBlockInfo((value) => !value)
    }
    , []);

  return (
    <div className="blockInfo">
      <div className="blockInfoTitle">
        <Button 
          icon={showBlockInfo ? <DownOutlined /> : <RightOutlined />} 
          shape="circle"
          type="primary" 
          onClick={handleShowDataClick} 
        />
        <Typography.Title level={3} style={{ marginLeft: '5px' }}>Block Info</Typography.Title>
      </div>

      {
        showBlockInfo && (
          <Row className="blockInfoData">
            <Col className="blockInfoItem" span={8}>
              <Row>
                <Text strong style={{ marginRight: '2px'}}>Block Number:</Text> 
                <Text>{blockInfo?.blockNumber}</Text>
              </Row>
              <Row>
                <Text strong style={{ marginRight: '2px'}}>Current Epoch:</Text> 
                <Text>{blockInfo?.epoch}</Text>
              </Row>
              <Row>
                <Text strong style={{ marginRight: '2px'}}>Next Epoch Block:</Text>
                <Text>
                  {blockInfo?.nextEpochBlock}
                  &nbsp;(in {blockInfo?.nextEpochInSec} sec
                  or {(blockInfo?.nextEpochInSec ?? 0 / 60).toFixed(1)} min)
                </Text>
              </Row>
              <Row>
                <Text strong style={{ marginRight: '2px'}}>Block Time:</Text>
                <Text>{blockInfo?.blockTime}</Text>
              </Row>
            </Col>
    
            <Col className="blockInfoItem" span={8}>
              <Row>
                <Text strong style={{ marginRight: '2px'}}>Active Validators Length:</Text>
                <Text>{blockInfo?.activeValidatorsLength}</Text>
              </Row>
              <Row>
                <Text strong style={{ marginRight: '2px'}}>Epoch Block Interval:</Text>
                <Text>{blockInfo?.epochBlockInterval}</Text>
              </Row>
              <Row>
                <Text strong style={{ marginRight: '2px'}}>Misdemeanor Threshold:</Text>
                <Text>{blockInfo?.misdemeanorThreshold}</Text>
              </Row>
              <Row>
                <Text strong style={{ marginRight: '2px'}}>Felony Threshold:</Text>
                <Text>{blockInfo?.felonyThreshold}</Text>
              </Row>
    
            </Col>
    
            <Col className="blockInfoItem" span={8}>
              <Row>
                <Text strong style={{ marginRight: '2px'}}>Validator Jail Epoch Length:</Text>
                <Text>{blockInfo?.validatorJailEpochLength}</Text>
              </Row>
              <Row>
                <Text strong style={{ marginRight: '2px'}}>Undelegate Period:</Text>
                <Text>{blockInfo?.undelegatePeriod}</Text>
              </Row>
              <Row>
                <Text strong style={{ marginRight: '2px'}}>Min Validator Stake Amount:</Text>
                <Text>{new BigNumber(`${blockInfo?.minValidatorStakeAmount}`).dividedBy(1e18).toString(10)}</Text>
              </Row>
              <Row>
                <Text strong style={{ marginRight: '2px'}}>Min Staking Amount:</Text>
                <Text>{new BigNumber(`${blockInfo?.minStakingAmount}`).dividedBy(1e18).toString(10)}</Text>
              </Row>
              <Row>
                <Text type="secondary">
                  P.S: MetaMask caches responses for 12 seconds
                </Text>
              </Row>
            </Col>
          </Row>
        )
      }
    </div>
  )
});

export default BlockInfo;