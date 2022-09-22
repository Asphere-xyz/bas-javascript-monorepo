import { IValidator } from "@ankr.com/bas-javascript-sdk";
import { Col, Collapse, Row, Tooltip } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useBasStore } from "src/stores";
import { VALIDATOR_WALLETS } from "src/utils/const";
import defaultValidatorImg from "src/assets/images/partners/default.png";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  CopyOutlined,
  DownOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

interface IValidatorCollapseHeader {
  validator: IValidator;
}

const ValidatorCollapseHeader = observer(
  ({ validator }: IValidatorCollapseHeader) => {
    /* -------------------------------------------------------------------------- */
    /*                                   States                                   */
    /* -------------------------------------------------------------------------- */
    const store = useBasStore();
    const [myStaked, setMyStaked] = useState<number>();
    const [myReward, setMyReward] = useState<number>();
    const [isLoading, setIsLoading] = useState(true);

    /* -------------------------------------------------------------------------- */
    /*                                   Methods                                  */
    /* -------------------------------------------------------------------------- */
    const inital = async () => {
      setIsLoading(true);
      setMyReward(await store.getMyValidatorReward(validator));
      setMyStaked(await store.getMyValidatorStaked(validator));
      setIsLoading(false);
    };

    /* -------------------------------------------------------------------------- */
    /*                                   Watches                                  */
    /* -------------------------------------------------------------------------- */
    useEffect(() => {
      inital();
    }, [store.walletAccount]);

    /* -------------------------------------------------------------------------- */
    /*                                    DOMS                                    */
    /* -------------------------------------------------------------------------- */
    return (
      <Row>
        {/* brand */}
        <Col className="item-brand" lg={5} sm={7} xs={14}>
          {/* validator brand */}
          <img
            alt={`validator ${
              VALIDATOR_WALLETS[validator.validator]?.name || "validator"
            }`}
            src={`${
              VALIDATOR_WALLETS[validator.validator]?.image ||
              defaultValidatorImg
            }`}
          />

          <b>
            {/* validator name or wallet */}
            {VALIDATOR_WALLETS[validator.validator]?.name ||
              [
                validator.validator.slice(0, 5),
                validator.validator.slice(-4),
              ].join("...")}
            <CopyToClipboard text={validator.validator}>
              <CopyOutlined
                className="copy-clipboard"
                style={{ marginLeft: "5px" }}
              />
            </CopyToClipboard>

            {/* validator status */}
            <Tooltip
              placement="right"
              title={store.getValidatorStatus(validator.status).status}
            >
              <div
                className="brand-status"
                style={{
                  background: store.getValidatorStatus(validator.status).color,
                }}
              />
            </Tooltip>
          </b>
        </Col>

        {/* cert */}
        <Col className="item-cert" lg={3} sm={4} xs={8}>
          {VALIDATOR_WALLETS[validator.validator]?.name && (
            <div>
              <SafetyCertificateOutlined /> <span>JFIN</span>
            </div>
          )}
        </Col>

        {/* total */}
        <Col className="item-total" lg={4}>
          <div>
            <span className="col-title">Total Stake</span>
            <div>{store.getValidatorTotalStake(validator)}</div>
          </div>
        </Col>

        {/* apr */}
        <Col className="item-apr" lg={4} sm={5}>
          <div>
            <span className="col-title">APR</span>
            <div>
              {store.getValidatorsApr(validator).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 0}
              %
            </div>
          </div>
        </Col>

        {/* earn */}
        <Col className="item-staking" lg={3} sm={4}>
          <div>
            <span className="col-title">Reward</span>
            <div>
              {myReward
                ? Number(myReward).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : 0}
            </div>
          </div>
        </Col>

        {/* staked */}
        <Col className="item-staking" lg={4} sm={2}>
          <div>
            <span className="col-title">Staked</span>
            <div>
              {myStaked
                ? Number(myStaked).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : 0}
            </div>
          </div>
        </Col>

        {/* icon */}
        <Col lg={1} sm={1} style={{ textAlign: "right" }} xs={1}>
          <div style={{ width: "100%" }}>
            <DownOutlined />
          </div>
        </Col>
      </Row>
    );
  }
);

export default ValidatorCollapseHeader;
