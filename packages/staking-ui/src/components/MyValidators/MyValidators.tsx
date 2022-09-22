/* eslint-disable no-nested-ternary */
import { IValidator } from "@ankr.com/bas-javascript-sdk";
import { LoadingOutlined } from "@ant-design/icons";
import { Col, Collapse, Row } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IMyValidators } from "src/pages/Assets/Assets";
import { useBasStore } from "src/stores";
import ValidatorCollapseContent from "../Validator/ValidatorCollapseContent";
import ValidatorCollapseHeader from "../Validator/ValidatorCollapseHeader";
import "../Validator/Validators.css";

interface IMyValidatorsProps {
  loading: boolean;
  validators: IMyValidators[] | undefined;
  refresh?: () => unknown;
}
const MyValidators = observer(
  ({ validators, loading, refresh }: IMyValidatorsProps) => {
    /* -------------------------------------------------------------------------- */
    /*                                   States                                   */
    /* -------------------------------------------------------------------------- */
    const { Panel } = Collapse;

    /* -------------------------------------------------------------------------- */
    /*                                    DOMS                                    */
    /* -------------------------------------------------------------------------- */
    const loadingValidator = (
      <Panel
        key="loading-validator"
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
    );
    const emptyValidator = (
      <Panel
        key="loading-validator"
        className="validators-item"
        header={
          <Row style={{ width: "100%" }}>
            <Col className="item-brand" xs={24} sm={24} md={24} lg={24} xl={24}>
              <div
                className="items-center justify-center"
                style={{ width: "100%", textAlign: "center", height: "44px" }}
              >
                <Link to="/staking" className="button lg">
                  Start Staking
                </Link>
              </div>
            </Col>
          </Row>
        }
      />
    );
    return (
      <div className="my-validators-container">
        <Collapse ghost bordered={false}>
          {!validators || loading
            ? loadingValidator
            : !validators.length
            ? emptyValidator
            : validators.map((v, index) => (
                <Panel
                  key={`validator-${index + 1}`}
                  className="validators-item"
                  header={
                    <ValidatorCollapseHeader validator={v.validatorProvider} />
                  }
                >
                  <ValidatorCollapseContent
                    refresh={refresh}
                    validator={v.validatorProvider}
                  />
                </Panel>
              ))}
        </Collapse>
      </div>
    );
  }
);

export default MyValidators;
