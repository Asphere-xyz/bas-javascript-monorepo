import { IValidator } from "@ankr.com/bas-javascript-sdk";
import { Col, Collapse, Row } from "antd";
import { observer } from "mobx-react";
import "./Validators.css";
import { LoadingOutlined } from "@ant-design/icons";
import { getCurrentEnv } from "src/stores";
import ValidatorCollapseContent from "./ValidatorCollapseContent";
import ValidatorCollapseHeader from "./ValidatorCollapseHeader";

interface IValidatorsProps {
  validators: undefined | IValidator[];
  refresh?: () => unknown;
  loading: boolean;
}

const Validators = observer(
  ({ validators, refresh, loading }: IValidatorsProps) => {
    /* -------------------------------------------------------------------------- */
    /*                                   States                                   */
    /* -------------------------------------------------------------------------- */
    const { Panel } = Collapse;

    const loadingValidator = Array.from(
      Array(getCurrentEnv() === "jfin" ? 5 : 3).keys()
    ).map((v, i) => (
      <Panel
        key={`loading-validator-${i + 1}`}
        className="validators-item"
        header={
          <Row style={{ width: "100%" }}>
            <Col className="item-brand" xs={24} sm={24} md={24} lg={24} xl={24}>
              <div
                className="items-center justify-center"
                style={{ width: "100%", textAlign: "center", height: "44px" }}
              >
                <LoadingOutlined spin />
              </div>
            </Col>
          </Row>
        }
      />
    ));

    return (
      <div className="validators-container">
        <div className="validators-wrapper">
          <Collapse ghost bordered={false}>
            {validators && !loading
              ? validators.map((v, index) => {
                  return (
                    <Panel
                      key={`validator-${index + 1}`}
                      className="validators-item"
                      header={<ValidatorCollapseHeader validator={v} />}
                    >
                      <ValidatorCollapseContent
                        validator={v}
                        refresh={refresh}
                      />
                    </Panel>
                  );
                })
              : loadingValidator}
          </Collapse>
        </div>
      </div>
    );
  }
);

export default Validators;
