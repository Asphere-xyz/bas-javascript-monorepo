import {IConfig} from "./config";
import {IChainConfig, IChainParams, IKeyProvider, IPendingTx, Web3Address, Web3Uint256} from "./types";
import Web3 from "web3";
import {sendTransactionAsync, waitForExpectedNetworkOrThrow} from "./metamask";
import {Contract} from "web3-eth-contract";
import detectEthereumProvider from "@metamask/detect-provider";
import prettyTime from 'pretty-time'
import BigNumber from "bignumber.js";

const STAKING_ABI = require('../src/abi/Staking.json')
const SLASHING_INDICATOR_ABI = require('../src/abi/SlashingIndicator.json')
const SYSTEM_REWARD_ABI = require('../src/abi/SystemReward.json')
const STAKING_POOL_ABI = require('../src/abi/StakingPool.json')
const GOVERNANCE_ABI = require('../src/abi/Governance.json')
const CHAIN_CONFIG_ABI = require('../src/abi/ChainConfig.json')
const RUNTIME_UPGRADE_ABI = require('../src/abi/RuntimeUpgrade.json')
const DEPLOYER_PROXY_ABI = require('../src/abi/DeployerProxy.json')

export class KeyProvider implements IKeyProvider {

  public accounts?: Web3Address[];
  public web3?: Web3;

  // addresses
  public stakingAddress?: Web3Address;
  public slashingIndicatorAddress?: Web3Address;
  public systemRewardAddress?: Web3Address;
  public stakingPoolAddress?: Web3Address;
  public governanceAddress?: Web3Address;
  public chainConfigAddress?: Web3Address;
  public runtimeUpgradeAddress?: Web3Address;
  public deployerProxyAddress?: Web3Address;
  // contracts
  public stakingContract?: Contract;
  public slashingIndicatorContract?: Contract;
  public systemRewardContract?: Contract;
  public stakingPoolContract?: Contract;
  public governanceContract?: Contract;
  public chainConfigContract?: Contract;
  public runtimeUpgradeContract?: Contract;
  public deployerProxyContract?: Contract;

  constructor(
    private readonly config: IConfig,
  ) {
  }

  public isConnected(): boolean {
    return !!this.web3;
  }

  public async connect(web3: Web3, withoutWallet?: boolean): Promise<void> {
    const remoteChainId = await web3.eth.getChainId();
    if (remoteChainId != this.config.chainId) {
      await waitForExpectedNetworkOrThrow(web3, this.config);
    }
    // init web3 state
    if (!withoutWallet) {
      this.accounts = await this.unlockAccounts(web3);
    }
    this.web3 = web3;
    // init system smart contracts
    // addresses
    this.stakingAddress = this.config.stakingAddress;
    this.slashingIndicatorAddress = this.config.slashingIndicatorAddress;
    this.systemRewardAddress = this.config.systemRewardAddress;
    this.stakingPoolAddress = this.config.stakingPoolAddress;
    this.governanceAddress = this.config.governanceAddress;
    this.chainConfigAddress = this.config.chainConfigAddress;
    this.runtimeUpgradeAddress = this.config.runtimeUpgradeAddress;
    this.deployerProxyAddress = this.config.deployerProxyAddress;
    // contracts
    this.stakingContract = new web3.eth.Contract(STAKING_ABI, this.config.stakingAddress);
    this.slashingIndicatorContract = new web3.eth.Contract(SLASHING_INDICATOR_ABI, this.config.slashingIndicatorAddress);
    this.systemRewardContract = new web3.eth.Contract(SYSTEM_REWARD_ABI, this.config.systemRewardAddress);
    this.stakingPoolContract = new web3.eth.Contract(STAKING_POOL_ABI, this.config.stakingPoolAddress);
    this.governanceContract = new web3.eth.Contract(GOVERNANCE_ABI, this.config.governanceAddress);
    this.chainConfigContract = new web3.eth.Contract(CHAIN_CONFIG_ABI, this.config.chainConfigAddress);
    this.runtimeUpgradeContract = new web3.eth.Contract(RUNTIME_UPGRADE_ABI, this.config.runtimeUpgradeAddress);
    this.deployerProxyContract = new web3.eth.Contract(DEPLOYER_PROXY_ABI, this.config.deployerProxyAddress);
  }

  public async connectFromInjected(): Promise<void> {
    const provider = await detectEthereumProvider()
    if (!provider) throw new Error(`There is no injected provider`)
    const web3 = new Web3(provider as any);
    try {
      await web3.eth.requestAccounts()
    } catch (e) {
      console.error(e)
      throw new Error(`Can't request provider's account`);
    }
    return this.connect(web3);
  }

  private async unlockAccounts(web3: Web3): Promise<Web3Address[]> {
    let unlockedAccounts: Web3Address[] = [];
    try {
      unlockedAccounts = await web3.eth.requestAccounts();
    } catch (e) {
      console.error(e);
      throw new Error('User denied access to account');
    }
    console.log(`Unlocked accounts: ${unlockedAccounts}`);
    if (!unlockedAccounts.length || !unlockedAccounts[0]) {
      throw new Error('Unable to detect unlocked MetaMask account');
    }
    return unlockedAccounts;
  }

  public async disconnect(): Promise<void> {
    this.web3 = undefined;
    this.accounts = undefined;
  }

  public getAccounts(): Web3Address[] {
    return this.accounts || []
  }

  public getMyAddress(): Web3Address {
    const [account] = this.accounts || []
    return account
  }

  public async getMyBalance(): Promise<Web3Uint256> {
    const myAddress = this.getMyAddress()
    return this.web3!.eth.getBalance(myAddress)
  }

  public async getBlockNumber(): Promise<number> {
    return this.web3!.eth.getBlockNumber()
  }

  public async getChainConfig(): Promise<IChainConfig> {
    const [
      activeValidatorsLength,
      epochBlockInterval,
      misdemeanorThreshold,
      felonyThreshold,
      validatorJailEpochLength,
      undelegatePeriod,
      minValidatorStakeAmount,
      minStakingAmount,
    ] = await Promise.all([
      this.chainConfigContract!.methods.getActiveValidatorsLength().call(),
      this.chainConfigContract!.methods.getEpochBlockInterval().call(),
      this.chainConfigContract!.methods.getMisdemeanorThreshold().call(),
      this.chainConfigContract!.methods.getFelonyThreshold().call(),
      this.chainConfigContract!.methods.getValidatorJailEpochLength().call(),
      this.chainConfigContract!.methods.getUndelegatePeriod().call(),
      this.chainConfigContract!.methods.getMinValidatorStakeAmount().call(),
      this.chainConfigContract!.methods.getMinStakingAmount().call(),
    ])
    return {
      activeValidatorsLength,
      epochBlockInterval,
      misdemeanorThreshold,
      felonyThreshold,
      validatorJailEpochLength,
      undelegatePeriod,
      minValidatorStakeAmount: new BigNumber(minValidatorStakeAmount).dividedBy(10 ** 18),
      minStakingAmount: new BigNumber(minStakingAmount).dividedBy(10 ** 18),
    };
  }

  public async getChainParams(): Promise<IChainParams> {
    const blockNumber = await this.getBlockNumber(),
      epochBlockInterval = await this.chainConfigContract!.methods.getEpochBlockInterval().call()
    let startBlock = ((blockNumber / epochBlockInterval) | 0) * epochBlockInterval,
      endBlock = startBlock + Number(epochBlockInterval)
    const blockTime = 3;
    return {
      blockNumber: blockNumber,
      epoch: (blockNumber / epochBlockInterval) | 0,
      nextEpochIn: prettyTime((endBlock - blockNumber) * blockTime * 1000 * 1000 * 1000, 's'),
      nextEpochBlock: endBlock,
      blockTime: blockTime,
    };
  }

  public async getCurrentEpoch(): Promise<number> {
    const chainParams = await this.getChainParams()
    return chainParams.epoch
  }

  public async sendTx(sendOptions: { to: string; data?: string; value?: string; gasLimit?: string; gasPrice?: string }): Promise<IPendingTx> {
    return await sendTransactionAsync(this.web3!, {
      from: this.accounts![0],
      to: sendOptions.to,
      value: sendOptions.value,
      data: sendOptions.data,
      gasLimit: sendOptions.gasLimit,
      gasPrice: sendOptions.gasPrice
    })
  }
}