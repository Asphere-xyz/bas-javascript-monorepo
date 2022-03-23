import {observer} from "mobx-react";
import {Button, Col, Form, Input, Row, Select} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useChilizStore} from "../stores";
import {useState} from "react";

export interface IGenerateThresholdKeyFormProps {
  isLoading?: boolean;
  isFetching?: boolean;
}

const AddDeployerForm = () => {
  return (
    <Row gutter={24}>
      <Col span={20} offset={2}>
        <Form.Item
          name="deployer"
          extra={<span>Deployer address to add.</span>}
          label="Deployer"
          rules={[
            {required: true, message: 'Required field'},
          ]}
        >
          <Input type={"text"}/>
        </Form.Item>
      </Col>
    </Row>
  )
}

const RemoveDeployerForm = () => {
  return (
    <Row gutter={24}>
      <Col span={20} offset={2}>
        <Form.Item
          name="deployer"
          extra={<span>Deployer address to remove.</span>}
          label="Deployer"
          rules={[
            {required: true, message: 'Required field'},
          ]}
        >
          <Input type={"text"}/>
        </Form.Item>
      </Col>
    </Row>
  )
}

const AddValidatorForm = () => {
  return (
    <Row gutter={24}>
      <Col span={20} offset={2}>
        <Form.Item
          name="validator"
          extra={<span>Validator address to add.</span>}
          label="Validator"
          rules={[
            {required: true, message: 'Required field'},
          ]}
        >
          <Input type={"text"}/>
        </Form.Item>
      </Col>
    </Row>
  )
}

const ActivateValidatorForm = () => {
  return (
    <Row gutter={24}>
      <Col span={20} offset={2}>
        <Form.Item
          name="validator"
          extra={<span>Validator address to activate.</span>}
          label="Validator"
          rules={[
            {required: true, message: 'Required field'},
          ]}
        >
          <Input type={"text"}/>
        </Form.Item>
      </Col>
    </Row>
  )
}

const RemoveValidatorForm = () => {
  return (
    <Row gutter={24}>
      <Col span={20} offset={2}>
        <Form.Item
          name="validator"
          extra={<span>Validator address to remove.</span>}
          label="Validator"
          rules={[
            {required: true, message: 'Required field'},
          ]}
        >
          <Input type={"text"}/>
        </Form.Item>
      </Col>
    </Row>
  )
}

const DisableContractForm = () => {
  return (
    <Row gutter={24}>
      <Col span={20} offset={2}>
        <Form.Item
          name="contract"
          extra={<span>Contract address to disable/enable.</span>}
          label="Contract"
          rules={[
            {required: true, message: 'Required field'},
          ]}
        >
          <Input type={"text"}/>
        </Form.Item>
      </Col>
    </Row>
  )
}

const CreateProposalForm = observer((props: IGenerateThresholdKeyFormProps) => {
  const store = useChilizStore()
  const [proposalType, setProposalType] = useState('add_deployer')
  return (
    <Form
      layout="vertical"
      onFinish={async (values) => {
      }}
    >
      <Row gutter={24}>
        <Col span={20} offset={2}>
          <Form.Item
            name="type"
            extra={<span>Type of proposal.</span>}
            label="Proposal Type"
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
        <Col span={20} offset={2}>
          <Form.Item
            name="description"
            extra={<span>Description for this proposal.</span>}
            label="Description"
            rules={[
              {required: true, message: 'Required field'},
            ]}
          >
            <Input.TextArea/>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item wrapperCol={{offset: 11}}>
        <Button type="primary" loading={props.isLoading} disabled={props.isLoading} htmlType="submit"
                icon={<PlusOutlined translate/>}>
          Propose, Vote & Execute
        </Button>
      </Form.Item>
    </Form>
  )
})

export default CreateProposalForm