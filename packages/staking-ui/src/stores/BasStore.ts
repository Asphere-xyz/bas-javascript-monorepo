import {BasSdk, IConfig, IExplorerConfig} from "@ankr.com/bas-javascript-sdk";
import {action, makeAutoObservable} from "mobx";

const makeDefaultConfig = (chainId: number, chainName: string, rpcUrl: string, explorerConfig?: IExplorerConfig): IConfig => {
  return {
    chainId,
    chainName,
    rpcUrl,
    explorerConfig,
    // BSC-compatible contracts
    stakingAddress: '0x0000000000000000000000000000000000001000',
    slashingIndicatorAddress: '0x0000000000000000000000000000000000001001',
    systemRewardAddress: '0x0000000000000000000000000000000000001002',
    // custom contracts
    stakingPoolAddress: '0x0000000000000000000000000000000000007001',
    governanceAddress: '0x0000000000000000000000000000000000007002',
    chainConfigAddress: '0x0000000000000000000000000000000000007003',
    runtimeUpgradeAddress: '0x0000000000000000000000000000000000007004',
    deployerProxyAddress: '0x0000000000000000000000000000000000007005',
  }
}

export const LOCAL_CONFIG: IConfig = makeDefaultConfig(1337, 'BAS devnet', 'http://localhost:8545/')
export const DEV_CONFIG: IConfig = makeDefaultConfig(14000, 'BAS testnet', 'https://rpc.dev-01.bas.ankr.com/', {
  homePage: 'https://explorer.dev-01.bas.ankr.com/',
  txUrl: 'https://explorer.dev-01.bas.ankr.com/tx/{tx}',
  addressUrl: 'https://explorer.dev-01.bas.ankr.com/address/{address}',
  blockUrl: 'https://explorer.dev-01.bas.ankr.com/block/{block}',
})

export class BasStore {

  public isConnected = false

  private readonly sdk: BasSdk

  public constructor(public readonly config: IConfig) {
    this.sdk = new BasSdk(config)
    makeAutoObservable(this)
  }

  public getBasSdk(): BasSdk {
    return this.sdk
  }

  @action
  public async connectFromInjected(): Promise<void> {
    this.isConnected = false
    if (!this.sdk.isConnected()) {
      await this.sdk.connect()
    }
    this.isConnected = true
    try {
      const block = await this.getBlockNumber()
      console.log(block)
    } catch (e) {
      console.error(e);
    }
  }

  public async getBlockNumber(): Promise<{
    blockNumber: number;
    epoch: number;
    nextEpochBlock: number;
    nextEpochIn: string;
    blockTime: number;
    activeValidatorsLength: number;
    epochBlockInterval: number;
    misdemeanorThreshold: number;
    felonyThreshold: number;
    validatorJailEpochLength: number;
    undelegatePeriod: number;
    minValidatorStakeAmount: number;
    minStakingAmount: number;
  }> {
    const chainConfig = await this.sdk.getChainConfig();
      const chainParams = await this.sdk.getChainParams();
    return { ...chainConfig, ...chainParams}
  }
}