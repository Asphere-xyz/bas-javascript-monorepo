/* eslint-disable */
import React, {ReactElement, useMemo} from 'react'
import {Button, Col, Divider, Form, Input, Row, TablePaginationConfig, Typography} from "antd";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {action, makeAutoObservable} from "mobx";
import {observer} from "mobx-react";
import BigNumber from "bignumber.js";
import FileSaver from 'file-saver';
import { Tooltip } from 'antd';
import {QuestionCircleOutlined} from "@ant-design/icons";

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

  public genesisValidators: { address: string; stake: number; }[] = [
    {address: "0x08fae3885e299c24ff9841478eb946f41023ac69", stake: 1000},
    {address: "0x751aaca849b09a3e347bbfe125cf18423cc24b40", stake: 1000},
    {address: "0xa6ff33e3250cc765052ac9d7f7dfebda183c4b9b", stake: 1000},
    {address: "0x49c0f7c8c11a4c80dc6449efe1010bb166818da8", stake: 1000},
    {address: "0x8e1ea6eaa09c3b40f4a51fcd056a031870a0549a", stake: 1000},
  ]

  public systemTreasury: { address: string; share: number }[] = [
    {address: '0x00a601f45688dba8a070722073b015277cf36725', share: 90},
    {address: '0x100dd6c27454cb1DAdd1391214A344C6208A8C80', share: 10},
  ]

  public faucet: { address: string; amount: number }[] = [
    {address: '0x00a601f45688dba8a070722073b015277cf36725', amount: 10_000},
    {address: '0xb891fe7b38f857f53a7b5529204c58d5c487280b', amount: 100_000_000},
  ]

  public constructor() {
    const that = this
    makeAutoObservable(this)
    try {
      const result = JSON.parse(localStorage.getItem('__state__')!)
      for (const [k, v] of Object.entries(result)) {
        (this as any)[k] = v;
      }
    } catch (e) {
      console.error(`Failed to read state from cache: ${e}`)
    }
    setInterval(() => {
      localStorage.setItem('__state__', JSON.stringify(that))
    }, 1000)
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
    const requestBody = {
      chainId: this.chainId,
      validators: this.genesisValidators.map(({address}) => address),
      systemTreasury: Object.fromEntries(this.systemTreasury.map(({address, share}) => [address, share * 100])),
      consensusParams: {
        activeValidatorsLength: this.activeValidatorsLength,
        epochBlockInterval: this.epochBlockInterval,
        misdemeanorThreshold: this.misdemeanorThreshold,
        felonyThreshold: this.felonyThreshold,
        validatorJailEpochLength: this.validatorJailEpochLength,
        undelegatePeriod: this.undelegatePeriod,
        minValidatorStakeAmount: '0x' + new BigNumber(this.minValidatorStakeAmount).multipliedBy(10 ** 18).toString(16),
        minStakingAmount: '0x' + new BigNumber(this.minStakingAmount).multipliedBy(10 ** 18).toString(16),
      },
      initialStakes: Object.fromEntries(this.genesisValidators.map(({
                                                                      address,
                                                                      stake
                                                                    }) => [address, '0x' + new BigNumber(stake).multipliedBy(10 ** 18).toString(16)])),
      votingPeriod: this.votingPeriod,
      faucet: Object.fromEntries(this.faucet.map(({
                                                    address,
                                                    amount
                                                  }) => [address, '0x' + new BigNumber(amount).multipliedBy(10 ** 18).toString(16)]))
    };
    console.log(`Request: ${JSON.stringify(requestBody, null, 2)}`);
    const resp = await fetch(`${window.location.protocol}//${window.location.hostname}:8080`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    })
    const body = await resp.text()
    if (resp.status !== 200) {
      alert(body);
      return
    }
    console.log(`Response: ${body}`);
    const file = new File([body], `genesis-${this.chainId}.json`, {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(file);
  }
}

interface IFormStateProps {
  store: FormStore,
}

const GenesisValidatorsField = observer(({store}: IFormStateProps): ReactElement => {
  return (
    <div>
      <input type="hidden" id="a"/>
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
           <h1>Genesis Configurator</h1>
           Genesis configurator allows you to generate a customized genesis config file for BNB Sidechain.<br />
           We suggest you use it while testing out a <a href="https://github.com/Ankr-network/bas-devnet-setup">demo setup</a>.<br />
           Set up the parameters below and click <b>Generate Genesis Config File</b> at the end of the page.<br /><br />
           <h2>Config Parameters</h2>
          </Col>
          <Col offset={4} span={16}>
            <Form.Item
              extra={<Typography.Text type="secondary">
                Unique Chain ID of your project</Typography.Text>}
              label={<Tooltip placement="right" title={<span>Hand-entered unique ID of your project. <br />Check your desired Chain ID on <a href="https://chainlist.org/">ChainList</a> and <a
                  href="https://www.bnbchainlist.org/">BNBChain list</a> and make sure it doesn't intersect with that of any other project's.</span>}>Chain ID <QuestionCircleOutlined/></Tooltip>}
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
              label={<Tooltip placement="right" title={<span>Initial set of validators that run when your start your BNB Sidechain instance.<br /> Add, remove, or update with any validator addresses of your choice. You can set up validators in the <a href="https://github.com/Ankr-network/bas-devnet-setup/tree/devel/keystore">keystore folder</a>. </span>}>Genesis Validator Set <QuestionCircleOutlined/></Tooltip>}
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
              extra={<Typography.Text type="secondary">Reward distribution scheme for system treasury</Typography.Text>}
              label={<Tooltip placement="right" title={<span>Treasury reward distribution scheme allows you to set up what addresses receive which % of the system treasury assets.<br /> System treasury is a fund that accumulates 1/16 from the validators rewards, which are formed from the transaction execution costs. <br />Treasury can use these assets for the system needs, such as bridging cost coverage. </span>}>System Treasury <QuestionCircleOutlined/></Tooltip>}
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
              extra={<Typography.Text type="secondary">Minimum number of active validators on the network</Typography.Text>}
              label={<Tooltip placement="right" title={<span>Your network can have a minimum amount of validators. <br /> More validators means more decentralization.<br />We suggest the minimum amount of validators not lower than 5 to maintain network availability and throughput. </span>}>Minimum Number of Active Validators <QuestionCircleOutlined/></Tooltip>}
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
              label={<Tooltip placement="right" title={<span>Length of an epoch, specified in blocks produced on the network. An epoch is a variable used in the calculatation of important blockchain events, such as gas consumption, rewards claiming period, duration of validator penalty, and so on.<br /> An optimal epoch length is very important. We suggest the length of 1 day (86400/3=28800, where 3s is constant block production time on BNB Chain).</span>}>Epoch Length <QuestionCircleOutlined/></Tooltip>}
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
              extra={<Typography.Text type="secondary">Number of missed blocks for a validator to be penalized
              </Typography.Text>}
              label={<Tooltip placement="right" title={<span>Number of missed blocks for a validator to lose their rewards for the current epoch. <br /> A validator may sometimes miss blocks due to network hiccups or going offline.<br /> It is part of the incentive scheme to keep the network stable and protected from malicious intents.</span>}>Validator Misdemeanor Threshold <QuestionCircleOutlined/></Tooltip>}
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
              extra={<Typography.Text type="secondary">Number of missed blocks for a validator to be jailed</Typography.Text>}
              label={<Tooltip placement="right" title={<span>Number of missed blocks for a validator to go to jail for N subsequent epochs. The duration of jail time is set via <b>Validator Jail Length</b>. <br /> A validator may sometimes miss blocks due to network hiccups or going offline.<br /> It is part of the incentive scheme to keep the network stable and protected from malicious intents.</span>}>Validator Felony Threshold <QuestionCircleOutlined/></Tooltip>}
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
              extra={<Typography.Text type="secondary">Jail time duration for a validator</Typography.Text>}
              label={<Tooltip placement="right" title={<span>Duration of jail time in epochs. A validator who missed N number of blocks set via <b>Validator Felony Threshold</b> An optimal epoch time is 1 day (28800).<br /> A validator may sometimes miss blocks due to network hiccups or going offline.<br /> It is part of the incentive scheme to keep the network stable and protected from malicious intents.</span>}>Validator Jail Length <QuestionCircleOutlined/></Tooltip>}
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
              extra={<Typography.Text type="secondary">Number of epochs before allowing to claim rewards</Typography.Text>}
              label={<Tooltip placement="right" title={<span>Number of epochs that should pass before users are able to claim their rewards.<br /> An optimal epoch time is 1 day (28800).<br /> It is part of the incentive scheme to keep the network stable and protected from malicious intents.</span>}>Undelegate Period <QuestionCircleOutlined/></Tooltip>}
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
              extra={<Typography.Text type="secondary">Minimum amount of tokens to create a validator</Typography.Text>}
              label={<Tooltip placement="right" title={<span>Minimum amount of tokens in ether (10<sup>18</sup>) to create a validator. The stake is locked and secures the validator's position, and protects network from malicious validators, as a validator may lose their stake for misbehaving.</span>}>Validator's Minimum Stake Amount <QuestionCircleOutlined/></Tooltip>}
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
              extra={<Typography.Text type="secondary">Minimum amount of tokens to create a delegated stake</Typography.Text>}
              label={<Tooltip placement="right" title={<span>Minimum amount of tokens in ether (10<sup>18</sup>) to stake with a chosen validator.<br /> Ordinary users may not have enough tokens or hardware power to create a validator, but they still can stake with a validator and receive a portion of that validator's rewards. <br />This is called delegated staking.</span>}>User's Minimum Stake Amount <QuestionCircleOutlined/></Tooltip>}
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
              extra={<Typography.Text type="secondary">Default voting period for proposed changes to governance
                </Typography.Text>}
              label={<Tooltip placement="right" title={<span>Network users are able to propose changes to the governance rules. Each proposal lives a limited time span to be voted for.<br /> After a defined period they get stale and are discarded.</span>}>Governance Voting Period <QuestionCircleOutlined/></Tooltip>}
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
              extra={<Typography.Text type="secondary">Map of initial balances for faucet and other system needs
              </Typography.Text>}
              label={<Tooltip placement="right" title={<span>Allocation scheme setting what address receives which number of tokens when the BNB Sidechain instance starts. <br /> These addresses are usually testnet faucets, system funds, and other necessary system tools.</span>}>Initial Allocation Scheme <QuestionCircleOutlined/></Tooltip>}
              name="faucet"
              rules={[
                {required: true, message: 'Required field'},
              ]}
            >
              <FaucetField store={store}/>
            </Form.Item>
          </Col>
          <Col offset={4} span={10}>
            <Divider/>
            <Button onClick={async () => {
              await store.submitForm()
            }} size="large" type="primary">Generate Genesis Config File</Button>
          </Col>
          <Col offset={4} span={2}>
            <Divider/>
            <Button onClick={async () => {
              localStorage.removeItem('__state__')
              window.location.reload()
            }} size="large">Reset to default</Button>
          </Col>
        </Row>
        <br/>
      </Form>
      <Divider/>
    </div>
  )
})