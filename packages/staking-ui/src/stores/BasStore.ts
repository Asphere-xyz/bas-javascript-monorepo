import {BasSdk, IChainConfig, IChainParams, IConfig, IExplorerConfig, IValidator} from "@ankr.com/bas-javascript-sdk";
import {action, makeAutoObservable, reaction} from "mobx";
import prettyTime from "pretty-time";

const makeExplorerConfig = (explorerUrl: string): IExplorerConfig => {
  if (!explorerUrl.endsWith('/')) explorerUrl += '/';
  return {
    homePage: `${explorerUrl}`,
    txUrl: `${explorerUrl}tx/{tx}`,
    addressUrl: `${explorerUrl}address/{address}`,
    blockUrl: `${explorerUrl}block/{block}`,
  };
}

export const makeDefaultConfig = (chainId: number, chainName: string, rpcUrl: string, explorerConfig?: IExplorerConfig | string): IConfig => {
  if (typeof explorerConfig === 'string') {
    explorerConfig = makeExplorerConfig(explorerConfig);
  }
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

export const LOCAL_CONFIG: IConfig = makeDefaultConfig(1337, 'Localhost 8545', 'http://localhost:8545/')
export const DEV_CONFIG: IConfig = makeDefaultConfig(16350, 'BAS devnet #1', 'https://rpc.dev-01.bas.ankr.com/', 'https://explorer.dev-01.bas.ankr.com/')
export const METAAPES_CONFIG: IConfig = makeDefaultConfig(16350, 'MetaApes', 'https://bas.metaapesgame.com/bas_mainnet_full_rpc', 'https://explorer.dev-02.bas.ankr.com/')
export const MRFOX_CONFIG: IConfig = makeDefaultConfig(701, 'MrFox', 'https://rpc.mrfoxchain.com', 'https://exp.mrfoxchain.com/')
export const JFIN_CONFIG: IConfig = makeDefaultConfig(3501, 'JFIN', 'https://rpc.jfinchain.com', 'https://exp.jfinchain.com/')
// export const JFIN_TESTNET_CONFIG: IConfig = makeDefaultConfig(3503, 'JFIN', 'http://65.108.44.103:8005/', 'https://exp.jfinchain.com/')
export const JFIN_TESTNET_CONFIG: IConfig = makeDefaultConfig(3502, 'JFIN', 'https://rpc.testnet.jfinchain.com', 'https://exp.testnet.jfinchain.com/')

export const CONFIGS: Record<string, IConfig> = {
  "localhost": makeDefaultConfig(1337, 'localhost', 'http://localhost:8545/'),
  "devnet-1": makeDefaultConfig(14000, 'BAS devnet #1', 'https://rpc.dev-01.bas.ankr.com/', 'https://explorer.dev-01.bas.ankr.com/'),
  "devnet-2": makeDefaultConfig(14001, 'BAS devnet #2', 'https://rpc.dev-02.bas.ankr.com/', 'https://explorer.dev-02.bas.ankr.com/'),
  "metaapes-mainnet": makeDefaultConfig(16350, 'MetaApes', 'https://bas.metaapesgame.com/bas_mainnet_full_rpc', 'https://explorer.bas.metaapesgame.com/'),
};

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

  public getConfigs(): Record<string, IConfig> {
    return CONFIGS;
  }

  @action
  public async connectFromInjected(): Promise<void> {
    this.isConnected = false
    if (!this.sdk.isConnected()) {
      await this.sdk.connect()
    }
    this.isConnected = true
    try {
      const block = await this.getChainConfig()
      console.log(`Block Info: ${JSON.stringify(block, null, 2)}`)
    } catch (e) {
      console.error(e);
    }
  }

  public async getChainConfig(): Promise<IChainConfig & IChainParams> {
    const chainConfig = await this.sdk.getChainConfig();
    const chainParams = await this.sdk.getChainParams();
    const result = {...chainConfig, ...chainParams}
    this.cachedChainConfig = result;
    return result;
  }

  private cachedChainConfig?: IChainConfig & IChainParams;

  public async getLatestChainConfig(): Promise<IChainConfig & IChainParams> {
    if (this.cachedChainConfig) return this.cachedChainConfig;
    return this.getChainConfig();
  }

  public async getReleaseInterval(validator: IValidator): Promise<{
    remainingBlocks: number;
    prettyTime: string;
  }> {
    const {blockNumber, blockTime, epochBlockInterval, nextEpochBlock, epoch} = await this.getChainConfig();
    if (validator.jailedBefore === 0) {
      return {remainingBlocks: 0, prettyTime: 'not in jail'};
    }
    if (epoch < validator.jailedBefore) {
      return {remainingBlocks: 0, prettyTime: 'can be released'};
    }
    const remainingBlocks = (Number(validator.jailedBefore) - epoch) * epochBlockInterval + (nextEpochBlock - blockNumber);
    const remainingTime = prettyTime(remainingBlocks * blockTime * 1000 * 1000 * 1000, 'm')
    return {remainingBlocks, prettyTime: remainingTime}
  }
}