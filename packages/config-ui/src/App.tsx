/* eslint-disable */
import React, {ReactElement, useMemo} from 'react'
import {Button, Col, Divider, Form, Input, Row, TablePaginationConfig, Typography} from "antd";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {action, makeAutoObservable} from "mobx";
import {observer} from "mobx-react";

export class FormStore {

  public chainId = 14000;

  public activeValidatorsLength = 25;

  public epochBlockInterval = 1200;

  public misdemeanorThreshold = 50;

  public felonyThreshold = 150;

  public validatorJailEpochLength = 7;

  public undelegatePeriod = 6;

  public minValidatorStakeAmount = 1;

  public minStakingAmount = 1;

  public votingPeriod = 60;

  public genesisValidators: { address: string; stake: number; }[] = [{address: '0x', stake: 1}]

  public systemTreasury: { address: string; share: number }[] = [{address: '0x', share: 100}]

  public faucet: { address: string; amount: number }[] = [{address: '0x', amount: 0}]

  public constructor() {
    makeAutoObservable(this)
  }

  @action
  setChainId(value: number) {
    this.chainId = value
  }

  @action
  setActiveValidatorsLength(value: number) {
    this.activeValidatorsLength = value;
  }

  @action
  setEpochBlockInterval(value: number) {
    this.epochBlockInterval = value;
  }

  @action
  setMisdemeanorThreshold(value: number) {
    this.misdemeanorThreshold = value;
  }

  @action
  setFelonyThreshold(value: number) {
    this.felonyThreshold = value;
  }

  @action
  setValidatorJailEpochLength(value: number) {
    this.validatorJailEpochLength = value;
  }

  @action
  setUndelegatePeriod(value: number) {
    this.undelegatePeriod = value;
  }

  @action
  setMinValidatorStakeAmount(value: number) {
    this.minValidatorStakeAmount = value;
  }

  @action
  setMinStakingAmount(value: number) {
    this.minStakingAmount = value;
  }

  @action
  addGenesisValidator() {
    this.genesisValidators.push({address: '0x', stake: 1})
  }

  @action
  setGenesisValidator(index: number, address: string | undefined, stake: number | undefined) {
    if (typeof address !== 'undefined') {
      this.genesisValidators[index].address = address
    }
    if (typeof stake !== 'undefined') {
      this.genesisValidators[index].stake = stake
    }
  }

  @action
  removeGenesisValidator(index: number) {
    this.genesisValidators.splice(index, 1)
  }

  @action
  addSystemTreasury() {
    this.systemTreasury.push({address: '0x', share: 1})
  }

  @action
  setSystemTreasury(index: number, address: string | undefined, share: number | undefined) {
    if (typeof address !== 'undefined') {
      this.systemTreasury[index].address = address
    }
    if (typeof share !== 'undefined') {
      this.systemTreasury[index].share = share
    }
  }

  @action
  removeSystemTreasury(index: number) {
    this.systemTreasury.splice(index, 1)
  }

  @action
  setVotingPeriod(value: number) {
    this.votingPeriod = value
  }

  @action
  addFaucet() {
    this.faucet.push({address: '0x', amount: 0})
  }

  @action
  setFaucet(index: number, address: string | undefined, amount: number | undefined) {
    if (typeof address !== 'undefined') {
      this.faucet[index].address = address
    }
    if (typeof amount !== 'undefined') {
      this.faucet[index].amount = amount
    }
  }

  @action
  removeFaucet(index: number) {
    this.faucet.splice(index, 1)
  }

  @action
  async submitForm(): Promise<void> {
    console.log(JSON.stringify(this, null, 2))
  }
}

interface IFormStateProps {
  store: FormStore,
}

const GenesisValidatorsField = observer(({store}: IFormStateProps): ReactElement => {
  return (
    <div>
      <Input.Group compact>
        {store.genesisValidators.map(({address, stake}, i) => (
          <>
            <Input placeholder="Recipient address (not smart contract)" size="large"
                   onChange={({target}) => {
                     const {value} = target as any
                     store.setGenesisValidator(i, value, undefined);
                   }}
                   style={{width: 'calc(60% - 50px)'}} value={address}/>
            <Input placeholder="Recipient address (not smart contract)" size="large"
                   onChange={({target}) => {
                     const {value} = target as any
                     store.setGenesisValidator(i, undefined, value);
                   }}
                   style={{width: 'calc(40% - 50px)'}} value={stake}/>
            {i === store.genesisValidators.length - 1 ? (
              <Button onClick={() => {
                store.addGenesisValidator()
              }} size="large" style={{width: '100px'}} type="primary">Add<PlusOutlined/></Button>
            ) : (
              <Button onClick={() => {
                store.removeGenesisValidator(i)
              }} size="large" style={{width: '100px'}} danger>Del<MinusOutlined/></Button>
            )}
          </>
        ))}
      </Input.Group>
    </div>
  );
})

const SystemTreasuryField = observer(({store}: IFormStateProps): ReactElement => {
  return (
    <div>
      <Input.Group compact>
        {store.systemTreasury.map(({address, share}, i) => (
          <>
            <Input placeholder="Recipient address (not smart contract)" size="large"
                   onChange={({target}) => {
                     const {value} = target as any
                     store.setSystemTreasury(i, value, undefined);
                   }}
                   style={{width: 'calc(50% - 50px)'}} value={address}/>
            <Input placeholder="Distribution share in %" size="large" style={{width: 'calc(50% - 50px)'}}
                   onChange={({target}) => {
                     const {value} = target as any
                     store.setSystemTreasury(i, undefined, value);
                   }}
                   value={share}/>
            {i === store.systemTreasury.length - 1 ? (
              <Button onClick={() => {
                store.addSystemTreasury()
              }} size="large" style={{width: '100px'}} type="primary">Add<PlusOutlined/></Button>
            ) : (
              <Button onClick={() => {
                store.removeSystemTreasury(i)
              }} size="large" style={{width: '100px'}} danger>Del<MinusOutlined/></Button>
            )}
          </>
        ))}
      </Input.Group>
    </div>
  );
})

const FaucetField = observer(({store}: IFormStateProps): ReactElement => {
  return (
    <div>
      <Input.Group compact>
        {store.faucet.map(({address, amount}, i) => (
          <>
            <Input placeholder="Recipient address" size="large"
                   onChange={({target}) => {
                     const {value} = target as any
                     store.setFaucet(i, value, undefined)
                   }}
                   style={{width: 'calc(50% - 50px)'}} value={address}/>
            <Input placeholder="Faucet amount" size="large" style={{width: 'calc(50% - 50px)'}}
                   onChange={({target}) => {
                     const {value} = target as any
                     store.setFaucet(i, undefined, value)
                   }}
                   value={amount}/>
            {i === store.faucet.length - 1 ? (
              <Button onClick={() => {
                store.addFaucet()
              }} size="large" style={{width: '100px'}} type="primary">Add<PlusOutlined/></Button>
            ) : (
              <Button onClick={() => {
                store.removeFaucet(i)
              }} size="large" style={{width: '100px'}} danger>Del<MinusOutlined/></Button>
            )}
          </>
        ))}
      </Input.Group>
    </div>
  );
})

export const App = observer((): ReactElement => {
  const store = useMemo(() => new FormStore(), [])
  return (
    <div>
      <Divider/>
      <Form
        layout="vertical"
        onFinish={async (values) => {
          console.log(values);
        }}
      >
        <Row gutter={24}>
          <Col offset={4} span={16}>
            <Form.Item
              extra={<Typography.Text type="secondary">Unique chain id for your project. Make sure it doesn`&apos;t
                intersect with values from <a href="https://chainlist.org/">https://chainlist.org/</a> or <a
                  href="https://www.bnbchainlist.org/">https://www.bnbchainlist.org/</a></Typography.Text>}
              label="Chain ID"
              name="chainId"
              rules={[
                {required: true, message: 'Required field'},
              ]}
            >
              <Input onChange={({target}) => {
                const {value} = target as any
                store.setChainId(value)
              }} type="text" defaultValue={store.chainId}/>
            </Form.Item>
          </Col>
          <Col offset={4} span={16}>
            <Form.Item
              extra={<Typography.Text type="secondary">List of genesis validator
                addresses</Typography.Text>}
              label="Genesis Validator Set"
              name="genesisValidators"
              rules={[
                {required: true, message: 'Required field'},
              ]}
            >
              <GenesisValidatorsField store={store}/>
            </Form.Item>
          </Col>
          <Col offset={4} span={16}>
            <Form.Item
              extra={<Typography.Text type="secondary">Reward distribution for system treasury</Typography.Text>}
              label="System Treasury"
              name="systemTreasury"
              rules={[
                {required: true, message: 'Required field'},
              ]}
            >
              <SystemTreasuryField store={store}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col offset={4} span={16}>
            <Form.Item
              extra={<Typography.Text type="secondary">How many active validators blockchain can
                have?</Typography.Text>}
              label="Active Validator Length"
              name="activeValidatorsLength"
              rules={[
                {required: true, message: 'Required field'},
              ]}
            >
              <Input onChange={({target}) => {
                const {value} = target as any
                store.setActiveValidatorsLength(value)
              }} defaultValue={store.activeValidatorsLength} type="number"/>
            </Form.Item>
          </Col>
          <Col offset={4} span={16}>
            <Form.Item
              extra={<Typography.Text type="secondary">Length of the epoch in blocks</Typography.Text>}
              label="Epoch Block Interval"
              name="epochBlockInterval"
              rules={[
                {required: true, message: 'Required field'},
              ]}
            >
              <Input onChange={({target}) => {
                const {value} = target as any
                store.setEpochBlockInterval(value)
              }} defaultValue={store.epochBlockInterval} type="number"/>
            </Form.Item>
          </Col>
          <Col offset={4} span={16}>
            <Form.Item
              extra={<Typography.Text type="secondary">After missing this amount of blocks per day validator losses all daily rewards (penalty)
              </Typography.Text>}
              label="Misdemeanor Threshold"
              name="misdemeanorThreshold"
              rules={[
                {required: true, message: 'Required field'},
              ]}
            >
              <Input onChange={({target}) => {
                const {value} = target as any
                store.setMisdemeanorThreshold(value)
              }} defaultValue={store.misdemeanorThreshold} type="number"/>
            </Form.Item>
          </Col>
          <Col offset={4} span={16}>
            <Form.Item
              extra={<Typography.Text type="secondary">After missing this amount of blocks per day validator goes in jail for N epochs</Typography.Text>}
              label="Felony Threshold"
              name="felonyThreshold"
              rules={[
                {required: true, message: 'Required field'},
              ]}
            >
              <Input onChange={({target}) => {
                const {value} = target as any
                store.setFelonyThreshold(value)
              }} defaultValue={store.felonyThreshold} type="number"/>
            </Form.Item>
          </Col>
          <Col offset={4} span={16}>
            <Form.Item
              extra={<Typography.Text type="secondary">How many epochs validator should stay in jail (7 epochs = ~7 days)</Typography.Text>}
              label="Validator Jail Epoch Length"
              name="validatorJailEpochLength"
              rules={[
                {required: true, message: 'Required field'},
              ]}
            >
              <Input onChange={({target}) => {
                const {value} = target as any
                store.setValidatorJailEpochLength(value)
              }} defaultValue={store.validatorJailEpochLength} type="number"/>
            </Form.Item>
          </Col>
          <Col offset={4} span={16}>
            <Form.Item
              extra={<Typography.Text type="secondary">Allow claiming funds only after N epochs</Typography.Text>}
              label="Undelegate Period"
              name="undelegatePeriod"
              rules={[
                {required: true, message: 'Required field'},
              ]}
            >
              <Input onChange={({target}) => {
                const {value} = target as any
                store.setUndelegatePeriod(value)
              }} defaultValue={store.undelegatePeriod} type="number"/>
            </Form.Item>
          </Col>
          <Col offset={4} span={16}>
            <Form.Item
              extra={<Typography.Text type="secondary">How many tokens validator must stake to create a validator (in ether)</Typography.Text>}
              label="Min Validator Stake Amount"
              name="minValidatorStakeAmount"
              rules={[
                {required: true, message: 'Required field'},
              ]}
            >
              <Input onChange={({target}) => {
                const {value} = target as any
                store.setMinValidatorStakeAmount(value)
              }} defaultValue={store.minValidatorStakeAmount} type="number"/>
            </Form.Item>
          </Col>
          <Col offset={4} span={16}>
            <Form.Item
              extra={<Typography.Text type="secondary">Minimum staking amount for delegators (in ether)</Typography.Text>}
              label="Min Staking Amount"
              name="minStakingAmount"
              rules={[
                {required: true, message: 'Required field'},
              ]}
            >
              <Input onChange={({target}) => {
                const {value} = target as any
                store.setMinStakingAmount(value)
              }} defaultValue={store.minStakingAmount} type="number"/>
            </Form.Item>
          </Col>
          <Col offset={4} span={16}>
            <Form.Item
              extra={<Typography.Text type="secondary">Default voting period for the governance proposals</Typography.Text>}
              label="Governance Voting Period"
              name="votingPeriod"
              rules={[
                {required: true, message: 'Required field'},
              ]}
            >
              <Input onChange={({target}) => {
                const {value} = target as any
                store.setVotingPeriod(value)
              }} defaultValue={store.votingPeriod} type="number"/>
            </Form.Item>
          </Col>
          <Col offset={4} span={16}>
            <Form.Item
              extra={<Typography.Text type="secondary">Map with initial balances for faucet and other needs
              </Typography.Text>}
              label="Faucet"
              name="faucet"
              rules={[
                {required: true, message: 'Required field'},
              ]}
            >
              <FaucetField store={store}/>
            </Form.Item>
          </Col>
          <Col offset={4} span={16}>
            <Divider/>
            <Button onClick={async () => {
              await store.submitForm()
            }} size="large" type="primary">Generate Genesis Config File</Button>
          </Col>
        </Row>
        <br/>
      </Form>
      <Divider/>
    </div>
  )
})