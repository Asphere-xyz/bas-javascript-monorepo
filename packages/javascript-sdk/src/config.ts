import {Web3Address} from "./types";

export interface IExplorerConfig {
  homePage: string;
  txUrl: string;
  addressUrl: string;
  blockUrl: string;
}

export interface IConfig {
  // chain params for MetaMask
  chainId: number;
  chainName: string;
  rpcUrl: string;
  explorerConfig?: IExplorerConfig;
  // BSC-compatible
  stakingAddress: Web3Address;
  slashingIndicatorAddress: Web3Address;
  systemRewardAddress: Web3Address;
  // BAS-defined
  stakingPoolAddress: Web3Address;
  governanceAddress: Web3Address;
  chainConfigAddress: Web3Address;
  runtimeUpgradeAddress: Web3Address;
  deployerProxyAddress: Web3Address;
  relayHubAddress?: Web3Address;
  crossChainBridgeAddress?: Web3Address;
}