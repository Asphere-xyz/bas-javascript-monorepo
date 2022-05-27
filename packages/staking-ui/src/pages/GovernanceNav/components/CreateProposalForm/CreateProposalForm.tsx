import {PlusOutlined} from "@ant-design/icons";
import {Button, Col, Form, Input, Row, Select, Typography, message} from "antd";
import {observer} from "mobx-react";
import {useState} from "react";
import {useBasStore} from "src/stores";

export interface IGenerateThresholdKeyFormProps {
  isLoading?: boolean;
  isFetching?: boolean;
}

const AddValidatorForm = () => {
  return (
    <Row gutter={24}>
      <Col offset={2} span={20}>
        <Form.Item
          extra={<Typography.Text type="secondary">Validator address to add.</Typography.Text>}
          label="Validator"
          name="address"
          rules={[
            {required: true, message: 'Required field'},
          ]}
        >
          <Input type="text"/>
        </Form.Item>
      </Col>
    </Row>
  )
}

const UpgradeRuntimeForm = () => {
  return (
    <Row gutter={24}>
      <Col offset={2} span={20}>
        <Form.Item
          extra={<Typography.Text type="secondary">System smart contract to upgrade.</Typography.Text>}
          label="Address"
          name="address"
          rules={[
            {required: true, message: 'Required field'},
          ]}
        >
          <Input type="text"/>
        </Form.Item>
        <Form.Item
          extra={<Typography.Text type="secondary">New bytecode to set.</Typography.Text>}
          label="Bytecode"
          name="bytecode"
          rules={[
            {required: true, message: 'Required field'},
          ]}
        >
          <Input.TextArea/>
        </Form.Item>
      </Col>
    </Row>
  )
}

const ActivateValidatorForm = () => {
  return (
    <Row gutter={24}>
      <Col offset={2} span={20}>
        <Form.Item
          extra={<Typography.Text type="secondary">Validator address to activate.</Typography.Text>}
          label="Validator"
          name="address"
          rules={[
            {required: true, message: 'Required field'},
          ]}
        >
          <Input type="text"/>
        </Form.Item>
      </Col>
    </Row>
  )
}

const DisableValidatorForm = () => {
  return (
    <Row gutter={24}>
      <Col offset={2} span={20}>
        <Form.Item
          extra={<Typography.Text type="secondary">Validator address to disable.</Typography.Text>}
          label="Validator"
          name="address"
          rules={[
            {required: true, message: 'Required field'},
          ]}
        >
          <Input type="text"/>
        </Form.Item>
      </Col>
    </Row>
  )
}

const RemoveValidatorForm = () => {
  return (
    <Row gutter={24}>
      <Col offset={2} span={20}>
        <Form.Item
          extra={<Typography.Text type="secondary">Validator address to remove.</Typography.Text>}
          label="Validator"
          name="address"
          rules={[
            {required: true, message: 'Required field'},
          ]}
        >
          <Input type="text"/>
        </Form.Item>
      </Col>
    </Row>
  )
}

const CreateProposalForm = observer((props: IGenerateThresholdKeyFormProps) => {
  const [proposalType, setProposalType] = useState('add_deployer');
  const store = useBasStore();

  const handleAddProposal = async (values: { type: string; description: string; address: string; bytecode: string; }) => {
    if (values.type === 'upgrade_runtime') {
      try {
        const a = await store.getBasSdk().getGovernance()
          .createProposal(values.description)
          .upgradeRuntime(values.address, values.bytecode);
        const tx = await store.getBasSdk().getGovernance().sendProposal(a)
        const receipt = await tx.receipt
        message.success('Proposal was successfully added!');
      } catch (e: any) {
        message.error(e.message);
      }
    } else if (values.type === 'add_validator') {
      try {
        const a = await store.getBasSdk().getGovernance()
          .createProposal(values.description)
          .addValidator(values.address);
        const tx = await store.getBasSdk().getGovernance().sendProposal(a)
        const receipt = await tx.receipt
        message.success('Proposal was successfully added!');
      } catch (e: any) {
        message.error(e.message);
      }
    } else if (values.type === 'remove_validator') {
      try {
        const a = await store.getBasSdk().getGovernance()
          .createProposal(values.description)
          .removeDeployer(values.address);
        const tx = await store.getBasSdk().getGovernance().sendProposal(a)
        const receipt = await tx.receipt
        message.success('Proposal was successfully added!');
      } catch (e: any) {
        message.error(e.message);
      }
    } else if (values.type === 'activate_validator') {
      try {
        const a = await store.getBasSdk().getGovernance()
          .createProposal(values.description)
          .activateValidator(values.address);
        const tx = await store.getBasSdk().getGovernance().sendProposal(a)
        const receipt = await tx.receipt
        message.success('Proposal was successfully added!');
      } catch (e: any) {
        message.error(e.message);
      }
    } else if (values.type === 'disable_validator') {
      try {
        const a = await store.getBasSdk().getGovernance()
          .createProposal(values.description)
          .disableValidator(values.address);
        const tx = await store.getBasSdk().getGovernance().sendProposal(a)
        const receipt = await tx.receipt
        message.success('Proposal was successfully added!');
      } catch (e: any) {
        message.error(e.message);
      }
    } else {
      message.error(`Unknown proposal`);
    }
  }

  return (
    <Form
      layout="vertical"
      onFinish={async (values) => {
        await handleAddProposal(values);
      }}
    >
      <Row gutter={24}>
        <Col offset={2} span={20}>
          <Form.Item
            extra={<Typography.Text type="secondary">Type of proposal.</Typography.Text>}
            label="Proposal Type"
            name="type"
            rules={[
              {required: true, message: 'Required field'},
            ]}
          >
            <Select
              placeholder="Proposal type"
              onChange={(value) => {
                setProposalType(`${value}`)
              }}
            >
              <Select.Option value="upgrade_runtime">
                Upgrade Runtime
              </Select.Option>

              <Select.Option value="activate_validator">
                Activate Validator
              </Select.Option>

              <Select.Option value="disable_validator">
                Disable Validator
              </Select.Option>

              <Select.Option value="add_validator">
                Add Validator
              </Select.Option>

              <Select.Option value="remove_validator">
                Remove Validator
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {proposalType === 'upgrade_runtime' && <UpgradeRuntimeForm/>}

      {proposalType === 'activate_validator' && <ActivateValidatorForm/>}

      {proposalType === 'disable_validator' && <DisableValidatorForm/>}

      {proposalType === 'add_validator' && <AddValidatorForm/>}

      {proposalType === 'remove_validator' && <RemoveValidatorForm/>}

      <Row gutter={24}>
        <Col offset={2} span={20}>
          <Form.Item
            extra={<Typography.Text type="secondary">Description for this proposal.</Typography.Text>}
            label="Description"
            name="description"
            rules={[
              {required: true, message: 'Required field'},
            ]}
          >
            <Input.TextArea/>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item wrapperCol={{offset: 16}}>
        <Button
          disabled={props.isLoading}
          htmlType="submit"
          icon={<PlusOutlined translate="yes"/>}
          loading={props.isLoading}
          type="primary"
        >
          Propose
        </Button>
      </Form.Item>
    </Form>
  )
})

export default CreateProposalForm