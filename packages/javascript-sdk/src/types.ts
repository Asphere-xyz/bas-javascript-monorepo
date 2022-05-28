import {Contract, EventData} from "web3-eth-contract";
import {PromiEvent, TransactionReceipt} from "web3-core";
import BigNumber from "bignumber.js";

export type Web3Address = string;
export type Web3Uint256 = string;

export interface IChainConfig {
  activeValidatorsLength: number;
  epochBlockInterval: number;
  misdemeanorThreshold: number;
  felonyThreshold: number;
  validatorJailEpochLength: number;
  undelegatePeriod: number;
  minValidatorStakeAmount: BigNumber;
  minStakingAmount: BigNumber;
}

export interface IChainParams {
  blockNumber: number;
  epoch: number;
  nextEpochBlock: number;
  nextEpochIn: string;
  blockTime: number;
}

export interface IKeyProvider {
  // addresses
  stakingAddress?: Web3Address;
  slashingIndicatorAddress?: Web3Address;
  systemRewardAddress?: Web3Address;
  stakingPoolAddress?: Web3Address;
  governanceAddress?: Web3Address;
  chainConfigAddress?: Web3Address;
  runtimeUpgradeAddress?: Web3Address;
  deployerProxyAddress?: Web3Address;
  // contracts
  stakingContract?: Contract;
  slashingIndicatorContract?: Contract;
  systemRewardContract?: Contract;
  stakingPoolContract?: Contract;
  governanceContract?: Contract;
  chainConfigContract?: Contract;
  runtimeUpgradeContract?: Contract;
  deployerProxyContract?: Contract;
}

export interface IPendingTx {
  transactionHash: string;
  receipt: PromiEvent<TransactionReceipt>;
}

export type TValidatorStatus = 'NOT_FOUND' | 'ACTIVE' | 'PENDING' | 'JAILED' | 'UNKNOWN';

export const VALIDATOR_STATUS_MAPPING: Record<any, TValidatorStatus> = {
  '0': 'NOT_FOUND',
  '1': 'ACTIVE',
  '2': 'PENDING',
  '3': 'JAILED',
};

export interface IValidator {
  validator: Web3Address;
  owner: Web3Address;
  prettyStatus: TValidatorStatus;
  status: Web3Uint256;
  slashesCount: number;
  totalDelegated: Web3Uint256;
  votingPower: number;
  changedAt: number;
  jailedBefore: number;
  claimedAt: number;
  commissionRate: Web3Uint256;
  totalRewards: Web3Uint256;
}

export interface IVotingPower {
  votingSupply: number;
  votingPower: number;
}

export enum TGovernanceProposalStatus {
  Pending,
  Active,
  Cancelled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed
}

export type TGovernanceVoteType = 'AGAINST' | 'FOR' | 'ABSTAIN';

export interface IGovernanceVote {
  type: TGovernanceVoteType,
  blockNumber: number;
  reason: string;
  voterAddress: Web3Address;
  weight: BigNumber;
  transactionHash: string;
}

export interface IGovernanceProposal {
  id: string;
  proposer: string;
  status: TGovernanceProposalStatus;
  targets: string[];
  values: string[];
  signatures: string[];
  inputs: string[];
  startBlock: string;
  endBlock: string;
  desc: string;
  votes: IGovernanceVote[];
  quorumRequired: BigNumber;
  totalPower: BigNumber;
  voteDistribution: Record<TGovernanceVoteType, BigNumber>;
}

export type IEventData = EventData

export interface IDelegatorDelegation {
  event?: IEventData;
  validator: Web3Address;
  staker: Web3Address;
  amount: Web3Uint256;
  epoch: number;
}

export interface IDelegatorUnDelegation {
  event?: IEventData;
  validator: Web3Address;
  staker: Web3Address;
  amount: Web3Uint256;
  epoch: number;
}

export interface IDelegatorClaim {
  event?: IEventData;
  validator: Web3Address;
  staker: Web3Address;
  amount: Web3Uint256;
  epoch: number;
}

export interface IDelegatorOneOfEvent {
  delegation?: IDelegatorDelegation;
  undelegation?: IDelegatorUnDelegation;
  claim?: IDelegatorClaim;
}

export interface IStakingRewards {
  validator: IValidator;
  amount: BigNumber;
}