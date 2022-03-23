import {action, makeAutoObservable} from "mobx";
import {BasSdk, IConfig} from "@ankr.com/bas-javascript-sdk";

const makeDefaultConfig = (chainId: number, chainName: string, rpcUrl: string): IConfig => {
  return {
    chainId: chainId,
    chainName: chainName,
    rpcUrl: rpcUrl,
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

export const DEVNET_CONFIG: IConfig = makeDefaultConfig(1337, 'BAS devnet', '')
export const TESTNET_CONFIG: IConfig = makeDefaultConfig(17242, 'BAS testnet', '')

export class BasStore {

  public isConnected: boolean = false

  private readonly sdk: BasSdk

  public constructor(private readonly config: IConfig) {
    this.sdk = new BasSdk(config)
    makeAutoObservable(this)
  }

  public getBasSdk(): BasSdk {
    return this.sdk
  }

  @action
  public async connectFromInjected() {
    this.isConnected = false
    if (!this.sdk.isConnected()) {
      await this.sdk.connect()
    }
    this.isConnected = true
    try {
      await this.getBlockNumber()
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
    const chainConfig = await this.sdk.getChainConfig(),
      chainParams = await this.sdk.getChainParams();
    return Object.assign({}, chainConfig, chainParams)
  }
}