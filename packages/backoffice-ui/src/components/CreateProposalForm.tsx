import {PlusOutlined} from "@ant-design/icons";
import {Button, Col, Form, Input, Row, Select} from "antd";
import {observer} from "mobx-react";
import {useState} from "react";

// import {useChilizStore} from "../stores";

export interface IGenerateThresholdKeyFormProps {
  isLoading?: boolean;
  isFetching?: boolean;
}

const AddDeployerForm = () => {
  return (
    <Row gutter={24}>
      <Col offset={2} span={20}>
        <Form.Item
          extra={<span>Deployer address to add.</span>}
          label="Deployer"
          name="deployer"
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

const RemoveDeployerForm = () => {
  return (
    <Row gutter={24}>
      <Col offset={2} span={20}>
        <Form.Item
          extra={<span>Deployer address to remove.</span>}
          label="Deployer"
          name="deployer"
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

const AddValidatorForm = () => {
  return (
    <Row gutter={24}>
      <Col offset={2} span={20}>
        <Form.Item
          extra={<span>Validator address to add.</span>}
          label="Validator"
          name="validator"
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

const ActivateValidatorForm = () => {
  return (
    <Row gutter={24}>
      <Col offset={2} span={20}>
        <Form.Item
          extra={<span>Validator address to activate.</span>}
          label="Validator"
          name="validator"
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
          extra={<span>Validator address to remove.</span>}
          label="Validator"
          name="validator"
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

const DisableContractForm = () => {
  return (
    <Row gutter={24}>
      <Col offset={2} span={20}>
        <Form.Item
          extra={<span>Contract address to disable/enable.</span>}
          label="Contract"
          name="contract"
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
  // const store = useChilizStore()
  const [proposalType, setProposalType] = useState('add_deployer')
  return (
    <Form
      layout="vertical"
      onFinish={async () => {
      }}
    >
      <Row gutter={24}>
        <Col offset={2} span={20}>
          <Form.Item
            extra={<span>Type of proposal.</span>}
            label="Proposal Type"
            name="type"
            rules={[
              {required: true, message: 'Required field'},
            ]}
          >
            <Select placeholder="Proposal type" onChange={(value) => {
              setProposalType(`${value}`)
            }}>
              <Select.Option value="add_deployer">Add Deployer</Select.Option>

              <Select.Option value="remove_deployer">Remove Deployer</Select.Option>

              <Select.Option value="add_validator">Add Validator</Select.Option>

              <Select.Option value="activate_validator">Activate Validator</Select.Option>

              <Select.Option value="remove_validator">Remove Validator</Select.Option>

              <Select.Option value="disable_contract">Disable Contract</Select.Option>

              <Select.Option value="enable_contract">Enable Contract</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {proposalType === 'add_deployer' && <AddDeployerForm/>}

      {proposalType === 'remove_deployer' && <RemoveDeployerForm/>}

      {proposalType === 'add_validator' && <AddValidatorForm/>}

      {proposalType === 'activate_validator' && <ActivateValidatorForm/>}

      {proposalType === 'remove_validator' && <RemoveValidatorForm/>}

      {proposalType === 'disable_contract' && <DisableContractForm/>}

      {proposalType === 'enable_contract' && <DisableContractForm/>}

      <Row gutter={24}>
        <Col offset={2} span={20}>
          <Form.Item
            extra={<span>Description for this proposal.</span>}
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

      <Form.Item wrapperCol={{offset: 11}}>
        <Button disabled={props.isLoading} htmlType="submit" icon={<PlusOutlined translate="yes" />} loading={props.isLoading}
                type="primary">
          Propose, Vote & Execute
        </Button>
      </Form.Item>
    </Form>
  )
})

export default CreateProposalForm