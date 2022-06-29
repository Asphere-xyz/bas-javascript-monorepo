import {PlusOutlined} from "@ant-design/icons";
import {Button, Col, Form, Input, Row, Select, Typography, message, InputNumber} from "antd";
import {observer} from "mobx-react";
import {useBasStore} from "src/stores";

export interface IGenerateThresholdKeyFormProps {
  isLoading?: boolean;
  isFetching?: boolean;
}

const BridgeTokensForm = observer((props: IGenerateThresholdKeyFormProps) => {
  const store = useBasStore();

  const handleRegisterValidator = async (values: { validator: string, commissionRate: number, initialStake: string }) => {
    console.log(`Registering new validator: ${JSON.stringify(values, null, 2)}`)
    await store.getBasSdk().getStaking().registerValidator(values.validator, values.commissionRate, values.initialStake);
    console.log(`New validator is registered`);
  }

  return (
    <Form
      layout="vertical"
      onFinish={async (values) => {
        await handleRegisterValidator(values);
      }}
    >
      <Row gutter={24}>
        <Col offset={2} span={20}>
          <Form.Item
            extra={<Typography.Text type="secondary">Validator address to register. This address will be used in the
              validator node configuration. We strictly suggest to use different validator and validator owner
              addresses.</Typography.Text>}
            label="Validator"
            name="validator"
            rules={[
              {required: true, message: 'Required field'},
              {
                validator: async (_, value) => {
                  if (!/0x[\da-f]/ig.test(value)) throw new Error(`Must be 0x prefixed address`)
                }
              }
            ]}
          >
            <Input type="text"/>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col offset={2} span={20}>
          <Form.Item
            extra={<Typography.Text type="secondary">Validator&apos;s initial commission rate. Value must be between 0%
              and 30%. This value can be changed in the future.</Typography.Text>}
            label="Commission Rate"
            name="commissionRate"
            rules={[
              {required: true, message: 'Required field'},
            ]}
          >
            <InputNumber min={0} max={30}/>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col offset={2} span={20}>
          <Form.Item
            extra={<Typography.Text type="secondary">Initial stake amount that will be used to create validator.</Typography.Text>}
            label="Initial Stake"
            name="initialStake"
            rules={[
              {required: true, message: 'Required field'},
              {
                validator: async (_, value) => {
                  const {minStakingAmount} = await store.getLatestChainConfig();
                  if (value < minStakingAmount) throw new Error(`Min staking amount is ${minStakingAmount}`);
                }
              }
            ]}
          >
            <InputNumber min={0}/>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item wrapperCol={{offset: 13}}>
        <Button
          disabled={props.isLoading}
          htmlType="submit"
          icon={<PlusOutlined translate="yes"/>}
          loading={props.isLoading}
          type="primary"
        >
          Register validator
        </Button>
      </Form.Item>
    </Form>
  )
})

export default BridgeTokensForm