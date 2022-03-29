import {BasSdk, IConfig} from "@ankr.com/bas-javascript-sdk";
import {action, makeAutoObservable} from "mobx";

const makeDefaultConfig = (chainId: number, chainName: string, rpcUrl: string): IConfig => {
  return {
    chainId,
    chainName,
    rpcUrl,
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

export const DEVNET_CONFIG: IConfig = makeDefaultConfig(1337, 'BAS devnet', 'http://localhost:8545/')
export const TESTNET_CONFIG: IConfig = makeDefaultConfig(14000, 'BAS testnet', 'https://rpc.dev-01.bas.ankr.com/')

export class BasStore {

  public isConnected = false

  private readonly sdk: BasSdk

  public constructor(private readonly config: IConfig) {
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
    nextEpochInSec: number;
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