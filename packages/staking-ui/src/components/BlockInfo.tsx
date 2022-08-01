import { Col, Row, Typography } from "antd"
import { BigNumber } from "bignumber.js"
import { observer } from "mobx-react"
import { useEffect, useState } from "react"
import { useBasStore } from "src/stores"
import { IChainConfig, IChainParams } from "@ankr.com/bas-javascript-sdk"
import prettyTime from "pretty-time"

type IBlockInfoData = IChainConfig & IChainParams

const { Text } = Typography

const BlockInfo = observer(() => {
  const store = useBasStore()

  const [blockInfo, setBlockInfo] = useState<IBlockInfoData | null>(null)
  useEffect(() => {
    setInterval(async () => {
      if (!store.isConnected) return
      setBlockInfo(await store.getChainConfig())
    }, 3_000)
  }, [store])
  const SPAN = 6
  if (!blockInfo) {
    return (
      <div className="blockInfo">
        <br />
        <div className="blockInfoData">
          <h3 style={{ marginTop: "25px", marginBottom: "25px" }}>
            Loading...
          </h3>
        </div>
      </div>
    )
  }
  return (
    <div className="blockInfo">
      <br />
      <Row className="blockInfoData" gutter={[16, 16]}>
        <Col className="blockInfoItem" md={SPAN} xs={24}>
          <Row>
            <Text strong style={{ marginRight: "2px" }}>
              Block Number:
            </Text>
            <Text>{blockInfo.blockNumber}</Text>
          </Row>
          <Row>
            <Text strong style={{ marginRight: "2px" }}>
              Current Epoch:
            </Text>
            <Text>{blockInfo.epoch}</Text>
          </Row>
          <Row>
            <Text strong style={{ marginRight: "2px" }}>
              Next Epoch Block:
            </Text>
            <Text>
              {blockInfo.nextEpochBlock}
              &nbsp;(in {blockInfo.nextEpochIn})
            </Text>
          </Row>
          <Row>
            <Text strong style={{ marginRight: "2px" }}>
              Block Time:
            </Text>
            <Text>{blockInfo.blockTime}</Text>
            <Text>&nbsp;sec.</Text>
          </Row>
        </Col>

        <Col className="blockInfoItem" md={SPAN} xs={24}>
          <Row>
            <Text strong style={{ marginRight: "2px" }}>
              Active Validators Length:
            </Text>
            <Text>{blockInfo.activeValidatorsLength}</Text>
          </Row>
          <Row>
            <Text strong style={{ marginRight: "2px" }}>
              Epoch Block Interval:
            </Text>
            <Text>{blockInfo.epochBlockInterval}</Text>
            <Text>
              &nbsp;(
              {prettyTime(
                blockInfo.epochBlockInterval * blockInfo.blockTime * 1e9,
                "m"
              )}
              )
            </Text>
          </Row>
          <Row>
            <Text strong style={{ marginRight: "2px" }}>
              Penalty Threshold:
            </Text>
            <Text>{blockInfo.felonyThreshold}</Text>
          </Row>
        </Col>

        <Col className="blockInfoItem" md={SPAN} xs={24}>
          <Row>
            <Text strong style={{ marginRight: "2px" }}>
              Validator Jail Epoch Length:
            </Text>
            <Text>{blockInfo.validatorJailEpochLength}</Text>
            <Text>
              &nbsp;(
              {prettyTime(
                blockInfo.validatorJailEpochLength *
                  blockInfo.epochBlockInterval *
                  blockInfo.blockTime *
                  1e9,
                "m"
              )}
              )
            </Text>
          </Row>
          <Row>
            <Text strong style={{ marginRight: "2px" }}>
              Undelegate Period:
            </Text>
            <Text>{blockInfo.undelegatePeriod}</Text>
            <Text>
              &nbsp;(
              {prettyTime(
                blockInfo.undelegatePeriod *
                  blockInfo.epochBlockInterval *
                  blockInfo.blockTime *
                  1e9,
                "m"
              )}
              )
            </Text>
          </Row>
          <Row>
            <Text strong style={{ marginRight: "2px" }}>
              Min Validator Stake Amount:
            </Text>
            <Text>{blockInfo.minValidatorStakeAmount.toString(10)}</Text>
          </Row>
          <Row>
            <Text strong style={{ marginRight: "2px" }}>
              Min Staking Amount:
            </Text>
            <Text>{blockInfo.minStakingAmount.toString(10)}</Text>
          </Row>
        </Col>
      </Row>
    </div>
  )
})

export default BlockInfo
