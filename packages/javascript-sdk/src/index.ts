import {IConfig} from "./config";
import {Governance} from "./governance";
import {KeyProvider} from "./provider";
import {Staking} from "./staking";
import {IChainConfig, IChainParams, Web3Address} from "./types";
import {PastEventOptions} from "web3-eth-contract";
import {RuntimeUpgrade} from "./runtime";
import BigNumber from "bignumber.js";

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

  public async transferToChapel(amount: BigNumber): Promise<void> {
    
  }
}