import {PlusOutlined} from "@ant-design/icons";
import {Button, Col, Form, Input, Row, Select, Typography} from "antd";
import {observer} from "mobx-react";
import {useState} from "react";
import { useBasStore } from "src/stores";

export interface IGenerateThresholdKeyFormProps {
  isLoading?: boolean;
  isFetching?: boolean;
}

const AddDeployerForm = () => {
  return (
    <Row gutter={24}>
      <Col offset={2} span={20}>
        <Form.Item
          extra={<Typography.Text type="secondary">Deployer address to add.</Typography.Text>}
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
          extra={<Typography.Text type="secondary">Deployer address to remove.</Typography.Text>}
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
          extra={<Typography.Text type="secondary">Validator address to add.</Typography.Text>}
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
          extra={<Typography.Text type="secondary">Validator address to activate.</Typography.Text>}
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
          extra={<Typography.Text type="secondary">Validator address to remove.</Typography.Text>}
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
          extra={<Typography.Text type="secondary">Contract address to disable/enable.</Typography.Text>}
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
  const [proposalType, setProposalType] = useState('add_deployer');
  const store = useBasStore();

  const handleAddProposal = async () => {
    // if (proposalType === 'add_deployer') {

    // }
    
    // if (proposalType === 'remove_deployer') {
      
    // }
    
    // if (proposalType === 'add_validator') {
      
    // }
    
    // if (proposalType === 'activate_validator') {
      
    // }
    
    // if (proposalType === 'remove_validator') {
      
    // }
    
    // if (proposalType === 'disable_contract') {
      
    // }

    // if (proposalType === 'enable_contract') {
      
    // }
  }
  
  return (
    <Form
      layout="vertical"
      onFinish={async () => {
        await handleAddProposal();
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
              <Select.Option value="add_deployer">
                Add Deployer
              </Select.Option>

              <Select.Option value="remove_deployer">
                Remove Deployer
              </Select.Option>

              <Select.Option value="add_validator">
                Add Validator
              </Select.Option>

              <Select.Option value="activate_validator">
                Activate Validator
              </Select.Option>

              <Select.Option value="remove_validator">
                Remove Validator
              </Select.Option>

              <Select.Option value="disable_contract">
                Disable Contract
              </Select.Option>

              <Select.Option value="enable_contract">
                Enable Contract
              </Select.Option>
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

      <Form.Item wrapperCol={{offset: 11}}>
        <Button 
          disabled={props.isLoading} 
          htmlType="submit" 
          icon={<PlusOutlined translate="yes" />} 
          loading={props.isLoading}
          type="primary"
        >
          Propose, Vote & Execute
        </Button>
      </Form.Item>
    </Form>
  )
})

export default CreateProposalForm