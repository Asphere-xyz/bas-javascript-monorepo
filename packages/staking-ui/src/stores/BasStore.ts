import {
  BasSdk,
  IChainConfig,
  IChainParams,
  IConfig,
  IExplorerConfig,
  IValidator,
  KeyProvider,
} from "@ankr.com/bas-javascript-sdk";
import BigNumber from "bignumber.js";
import { action, makeAutoObservable } from "mobx";
import prettyTime from "pretty-time";
import defaultValidatorImg from "src/assets/images/partners/default.png";
import {
  BLOCK_REWARD,
  GWEI,
  MAIN_CHAIN_ID,
  TEST_CHAIN_ID,
  VALIDATOR_WALLETS,
} from "src/utils/const";

const makeExplorerConfig = (explorerUrl: string): IExplorerConfig => {
  if (!explorerUrl.endsWith("/")) explorerUrl += "/";
  return {
    homePage: `${explorerUrl}`,
    txUrl: `${explorerUrl}tx/{tx}`,
    addressUrl: `${explorerUrl}address/{address}`,
    blockUrl: `${explorerUrl}block/{block}`,
  };
};

export const makeDefaultConfig = (
  chainId: number,
  chainName: string,
  rpcUrl: string,
  explorerConfig?: IExplorerConfig | string
): IConfig => {
  if (typeof explorerConfig === "string") {
    explorerConfig = makeExplorerConfig(explorerConfig);
  }
  return {
    chainId,
    chainName,
    rpcUrl,
    explorerConfig,
    // BSC-compatible contracts
    stakingAddress: "0x0000000000000000000000000000000000001000",
    slashingIndicatorAddress: "0x0000000000000000000000000000000000001001",
    systemRewardAddress: "0x0000000000000000000000000000000000001002",
    // custom contracts
    stakingPoolAddress: "0x0000000000000000000000000000000000007001",
    governanceAddress: "0x0000000000000000000000000000000000007002",
    chainConfigAddress: "0x0000000000000000000000000000000000007003",
    runtimeUpgradeAddress: "0x0000000000000000000000000000000000007004",
    deployerProxyAddress: "0x0000000000000000000000000000000000007005",
  };
};

export const LOCAL_CONFIG: IConfig = makeDefaultConfig(
  1337,
  "Localhost 8545",
  "http://localhost:8545/"
);
export const DEV_CONFIG: IConfig = makeDefaultConfig(
  16350,
  "BAS devnet #1",
  "https://rpc.dev-01.bas.ankr.com/",
  "https://explorer.dev-01.bas.ankr.com/"
);
export const METAAPES_CONFIG: IConfig = makeDefaultConfig(
  16350,
  "MetaApes",
  "https://bas.metaapesgame.com/bas_mainnet_full_rpc",
  "https://explorer.dev-02.bas.ankr.com/"
);
export const MRFOX_CONFIG: IConfig = makeDefaultConfig(
  701,
  "MrFox",
  "https://rpc.mrfoxchain.com",
  "https://exp.mrfoxchain.com/"
);
export const JFIN_CONFIG: IConfig = makeDefaultConfig(
  3501,
  "JFIN",
  "https://rpc.jfinchain.com",
  "https://exp.jfinchain.com/"
);
// export const JFIN_TESTNET_CONFIG: IConfig = makeDefaultConfig(3503, 'JFIN', 'http://65.108.44.103:8005/', 'https://exp.jfinchain.com/')
export const JFIN_TESTNET_CONFIG: IConfig = makeDefaultConfig(
  3502,
  "JFIN",
  "https://rpc.testnet.jfinchain.com",
  "https://exp.testnet.jfinchain.com/"
);

export const CONFIGS: Record<string, IConfig> = {
  localhost: makeDefaultConfig(1337, "localhost", "http://localhost:8545/"),
  "devnet-1": makeDefaultConfig(
    14000,
    "BAS devnet #1",
    "https://rpc.dev-01.bas.ankr.com/",
    "https://explorer.dev-01.bas.ankr.com/"
  ),
  "devnet-2": makeDefaultConfig(
    14001,
    "BAS devnet #2",
    "https://rpc.dev-02.bas.ankr.com/",
    "https://explorer.dev-02.bas.ankr.com/"
  ),
  "metaapes-mainnet": makeDefaultConfig(
    16350,
    "MetaApes",
    "https://bas.metaapesgame.com/bas_mainnet_full_rpc",
    "https://explorer.bas.metaapesgame.com/"
  ),
};

export class BasStore {
  public isConnected = false;

  public walletAccount: string[] | undefined = undefined;

  public walletBalance: string = Number(0).toFixed(5);

  public chainInfo: (IChainConfig & IChainParams) | undefined = undefined;

  private provider: KeyProvider | undefined = undefined;

  private readonly sdk: BasSdk;

  public constructor(public readonly config: IConfig) {
    this.sdk = new BasSdk(config);
    makeAutoObservable(this);
  }

  public getBasSdk(): BasSdk {
    return this.sdk;
  }

  public getConfigs(): Record<string, IConfig> {
    return CONFIGS;
  }

  public getWalletAccount() {
    if (this.walletAccount)
      return [
        this.walletAccount[0].slice(0, 5),
        this.walletAccount[0].slice(-5),
      ].join("....");
    return undefined;
  }

  public getWalletBalance() {
    return Number(
      (Number(this.walletBalance) / GWEI).toFixed(5)
    ).toLocaleString();
  }

  updateAccount(accounts: string[] | undefined) {
    this.walletAccount = accounts;
  }

  updateIsConnect(status: boolean) {
    this.isConnected = status;
  }

  updateKeyProvider(provider: KeyProvider) {
    this.provider = provider;
  }

  @action
  public async listenAccountChange(): Promise<void> {
    window.ethereum?.on("accountsChanged", async () => {
      if (!this.isConnected) return;

      // force reload
      window.location.reload();
      // const accounts = await this.provider?.web3?.eth?.getAccounts();
      // await this.connectFromInjected();
      // await this.updateKeyProvider(await this.getBasSdk().getKeyProvider());
      // await this.updateAccount(accounts);
    });
  }

  @action
  public async listenChainChange(): Promise<void> {
    window.ethereum?.on("chainChanged", async () => {
      // force reload
      window.location.reload();
      // const chainid = await this.provider?.web3?.eth.getChainId();

      // // auto connect to wallet
      // if (chainid && [MAIN_CHAIN_ID, TEST_CHAIN_ID].includes(chainid)) {
      //   this.provider?.connectFromInjected();
      // } else {
      //   this.disconnect();
      // }
    });
  }

  @action
  public async refresh() {
    this.isConnected = false;
    await this.updateKeyProvider(await this.getBasSdk().getKeyProvider());
    this.walletAccount = await this.provider?.accounts;
    this.walletBalance =
      (await this.provider?.getMyBalance()) || Number(0).toFixed(5);
    this.isConnected = true;
  }

  @action
  public async connectFromInjected(): Promise<void> {
    if (!this.walletAccount) {
      await this.sdk.connect();
      await this.updateKeyProvider(await this.getBasSdk().getKeyProvider());
      await this.fetchChainInfo();
      this.walletAccount = this.provider?.accounts;
      this.walletBalance =
        (await this.provider?.getMyBalance()) || Number(0).toFixed(5);
    }
    this.isConnected = true;
  }

  @action
  public async connectProvider() {
    await this.sdk.connectProvider();
    this.isConnected = true;
    await this.connectFromInjected();
  }

  @action
  public async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    const provider = await this.sdk.getKeyProvider();
    await provider.disconnect();
    await this.sdk.connectProvider();
    this.isConnected = true;
    this.walletAccount = undefined;
    this.walletBalance = Number(0).toFixed(5);
  }

  @action async fetchChainInfo() {
    const chain = await this.getChainConfig();
    this.chainInfo = chain;
  }

  public async getMyValidator() {
    if (!this.walletAccount) return;
    const myValidator = await await this.sdk
      .getStaking()
      .getMyActiveDelegations();

    const myValidatorFormat = await myValidator
      .filter((i) => Number(i.amount))
      .map(async (v) => {
        return {
          ...v,
          amount: new BigNumber(v.amount).dividedBy(GWEI).toNumber(),
          validatorProvider: await this.sdk
            .getStaking()
            .loadValidatorInfo(v.validator),
        };
      });

    return Promise.all(myValidatorFormat);
  }

  public async getMyTransactionHistory(): Promise<
    IMyTransactionHistory[] | undefined
  > {
    if (!this.walletAccount) return;
    const address = await this.sdk.getKeyProvider().getMyAddress();
    const history = await this.sdk
      .getStaking()
      .getAllEventsHistory({ staker: address });

    const historyFormat = await history
      .map((record) => {
        return Object.entries(record).map(([key, value]) => {
          return {
            ...value,
            type: key,
            amount: new BigNumber(value.amount).dividedBy(GWEI).toNumber(),
            validatorMask: VALIDATOR_WALLETS[value.validator] || {
              name: [
                value.validator.slice(0, 5),
                value.validator.slice(-4),
              ].join("..."),
              image: defaultValidatorImg,
              validator: value.validator,
            },
          };
        })[0];
      })
      .reverse();

    return historyFormat as IMyTransactionHistory[];
  }

  public getValidatorStatus(status: string) {
    switch (status) {
      case "0":
        return { status: "Notfound", color: "#2e3338" };
      case "1":
        return { status: "Active", color: "green" };
      case "2":
        return { status: "Pending", color: "orange" };
      case "3":
        return { status: "Jailed", color: "red" };
      default:
        return { status: "Notfound", color: "#2e3338" };
    }
  }

  public getValidatorsApr(validator?: IValidator) {
    if (!validator) return "N/A";

    let result;
    const reward = new BigNumber(validator.totalRewards).plus(BLOCK_REWARD);
    const apr =
      365 * (100 * reward.dividedBy(validator.totalDelegated).toNumber());

    if (apr === 0) {
      result = `0%`;
    } else if (apr.toFixed(3) === "0.000") {
      result = `>0%`;
    } else {
      result = Number(apr);
    }

    return result;
  }

  public getSlasher(validator?: IValidator) {
    if (!validator) return "N/A";

    return validator.slashesCount.toLocaleString();
  }

  public getCommisionrate(validator?: IValidator) {
    if (!validator) return "N/A";
    return `${Number(
      Number(validator.commissionRate).toFixed(2)
    ).toLocaleString()}%`;
  }

  public getValidatorTotalStake(validator?: IValidator) {
    if (!validator) return "N/A";
    return `${new BigNumber(validator.totalDelegated)
      .dividedBy(GWEI)
      .toNumber()
      .toLocaleString()}`;
  }

  // public async getMyValidatorReward() {
  //   const rewards = await this.sdk
  //     ?.getStaking()
  //     ?.getMyClaimableStakingRewards();
  //   if (!rewards) return;

  //   const validatorRewards: Record<string, string> = {};
  //   rewards.map((reward) => {
  //     validatorRewards[reward.validator.validator] = (+reward.amount.toFixed(
  //       2
  //     )).toLocaleString();
  //     return {};
  //   });

  //   return validatorRewards;
  // }

  public async getMyValidatorReward(validator: IValidator) {
    const reward = await this.getBasSdk()
      .getStaking()
      .getMyStakingRewards(validator.validator);
    return Number(reward) / GWEI;
  }

  public async getMyValidatorStaked(validator: IValidator) {
    const total = await this.getBasSdk()
      .getStaking()
      .getMyDelegatedAmount(validator.validator);

    return Number(total) / GWEI;
  }

  public async getChainConfig(): Promise<IChainConfig & IChainParams> {
    const chainConfig = await this.sdk.getChainConfig();
    const chainParams = await this.sdk.getChainParams();
    const result = { ...chainConfig, ...chainParams };
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
    const {
      blockNumber,
      blockTime,
      epochBlockInterval,
      nextEpochBlock,
      epoch,
    } = await this.getChainConfig();
    if (validator.jailedBefore === 0) {
      return { remainingBlocks: 0, prettyTime: "not in jail" };
    }
    if (epoch < validator.jailedBefore) {
      return { remainingBlocks: 0, prettyTime: "can be released" };
    }
    const remainingBlocks =
      (Number(validator.jailedBefore) - epoch) * epochBlockInterval +
      (nextEpochBlock - blockNumber);
    const remainingTime = prettyTime(
      remainingBlocks * blockTime * 1000 * 1000 * 1000,
      "m"
    );
    return { remainingBlocks, prettyTime: remainingTime };
  }
}
