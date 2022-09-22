import { LoadingOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { observer } from "mobx-react";
import "./ValidatorInfo.css";

interface IValidatorProps {
  activeValidators: number;
  totalValidators: number;
  bondedTokens: string;
  isLoading: boolean;
}

const ValidatorInfo = observer((props: IValidatorProps) => {
  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="validator-info-container">
      <Row className="validator-info-wrapper" gutter={[24, 24]}>
        <Col md={12} xs={24}>
          <div>
            <span>Validators</span>
            {!props.isLoading ? (
              <b>
                {props.activeValidators}/{props.totalValidators}
              </b>
            ) : (
              <div>
                <LoadingOutlined spin />
              </div>
            )}
          </div>
        </Col>
        <Col md={12} xs={24}>
          <div>
            <span>Bonded Tokens</span>
            {!props.isLoading ? (
              <b>{(+(+props.bondedTokens).toFixed(2)).toLocaleString()}</b>
            ) : (
              <div>
                <LoadingOutlined spin />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
});

export default ValidatorInfo;
