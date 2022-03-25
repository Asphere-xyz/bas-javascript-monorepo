import {IConfig} from "./config";
import {Governance} from "./governance";
import {KeyProvider} from "./provider";
import {Staking} from "./staking";
import {IChainConfig, IChainParams, Web3Address} from "./types";
import {PastEventOptions} from "web3-eth-contract";
import {RuntimeUpgrade} from "./runtime";

export * from './config'
export * from './governance'
export * from './metamask'
export * from './provider'
export * from './staking'
export * from './types'

export class BasSdk {

  private keyProvider?: KeyProvider;
  private staking?: Staking;
  private runtimeUpgrade?: RuntimeUpgrade;
  private governance?: Governance;

  constructor(
    private readonly config: IConfig
  ) {
  }

  public isConnected(): boolean {
    if (!this.keyProvider) return false
    return this.keyProvider.isConnected()
  }

  public async connect(): Promise<void> {
    const keyProvider = new KeyProvider(this.config)
    // connect web3
    await keyProvider.connectFromInjected()
    // init providers
    this.keyProvider = keyProvider
    this.staking = new Staking(keyProvider)
    this.governance = new Governance(keyProvider)
  }

  public getKeyProvider(): KeyProvider {
    return this.keyProvider!;
  }

  public getStaking(): Staking {
    return this.staking!;
  }

  public getRuntimeUpgrade(): RuntimeUpgrade {
    return this.runtimeUpgrade!;
  }

  public getGovernance(): Governance {
    return this.governance!;
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
      this.keyProvider!.chainConfigContract!.methods.getActiveValidatorsLength().call(),
      this.keyProvider!.chainConfigContract!.methods.getEpochBlockInterval().call(),
      this.keyProvider!.chainConfigContract!.methods.getMisdemeanorThreshold().call(),
      this.keyProvider!.chainConfigContract!.methods.getFelonyThreshold().call(),
      this.keyProvider!.chainConfigContract!.methods.getValidatorJailEpochLength().call(),
      this.keyProvider!.chainConfigContract!.methods.getUndelegatePeriod().call(),
      this.keyProvider!.chainConfigContract!.methods.getMinValidatorStakeAmount().call(),
      this.keyProvider!.chainConfigContract!.methods.getMinStakingAmount().call(),
    ])
    return {
      activeValidatorsLength,
      epochBlockInterval,
      misdemeanorThreshold,
      felonyThreshold,
      validatorJailEpochLength,
      undelegatePeriod,
      minValidatorStakeAmount,
      minStakingAmount,
    };
  }

  public async getChainParams(): Promise<IChainParams> {
    const blockNumber = await this.keyProvider!.getBlockNumber(),
      epochBlockInterval = await this.keyProvider!.chainConfigContract!.methods.getEpochBlockInterval().call()
    let startBlock = ((blockNumber / epochBlockInterval) | 0) * epochBlockInterval,
      endBlock = startBlock + Number(epochBlockInterval)
    return {
      blockNumber: blockNumber,
      epoch: (blockNumber / epochBlockInterval) | 0,
      nextEpochInSec: (endBlock - blockNumber) * 3,
      nextEpochBlock: endBlock,
      blockTime: 3,
    };
  }

  public async getDeployers(options: PastEventOptions = {}): Promise<any[]> {
    const deployersAdded = await this.keyProvider!.deployerProxyContract!.getPastEvents('DeployerAdded', options) as any[],
      deployersRemoved = await this.keyProvider!.deployerProxyContract!.getPastEvents('DeployerRemoved', options) as any[]
    const result = new Map<Web3Address, any>()
    for (const log of deployersAdded.concat(deployersRemoved)) {
      const {returnValues: {account}} = log
      if (log.event === 'DeployerAdded') {
        result.set(account, log)
      } else if (log.event === 'DeployerRemoved') {
        result.delete(account)
      }
    }
    return Array.from(result.values()).map((log: any) => {
      return {...log, ...log.returnValues}
    })
  }
}