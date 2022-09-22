import {IConfig} from "./config";
import {Governance} from "./governance";
import {KeyProvider} from "./provider";
import {Staking} from "./staking";
import {IChainConfig, IChainParams, Web3Address} from "./types";
import {PastEventOptions} from "web3-eth-contract";
import {RuntimeUpgrade} from "./runtime";
import Web3 from "web3";

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

  public async connectProvider() {
    const keyProvider = new KeyProvider(this.config)
    const httpProvider = new Web3.providers.HttpProvider(this.config.rpcUrl)
    const web3 = new Web3(httpProvider);
    await keyProvider.connect(web3, true)

    this.keyProvider = keyProvider
    this.staking = new Staking(keyProvider)
    this.runtimeUpgrade = new RuntimeUpgrade(keyProvider)
    this.governance = new Governance(keyProvider)
  }

  public async connect(): Promise<void> {
    const keyProvider = new KeyProvider(this.config)
    // connect web3
    await keyProvider.connectFromInjected()
    // init providers
    this.keyProvider = keyProvider
    this.staking = new Staking(keyProvider)
    this.runtimeUpgrade = new RuntimeUpgrade(keyProvider)
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
    return this.keyProvider!.getChainConfig()
  }

  public async getChainParams(): Promise<IChainParams> {
    return this.keyProvider!.getChainParams()
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