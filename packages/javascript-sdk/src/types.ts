import {Contract} from "web3-eth-contract";
import {PromiEvent, TransactionReceipt} from "web3-core";

export type Web3Address = string;
export type Web3Uint256 = string;

export interface IChainConfig {
    activeValidatorsLength: number;
    epochBlockInterval: number;
    misdemeanorThreshold: number;
    felonyThreshold: number;
    validatorJailEpochLength: number;
    undelegatePeriod: number;
    minValidatorStakeAmount: number;
    minStakingAmount: number;
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

export interface IValidator {
    validator: Web3Address;
    owner: Web3Address;
    status: Web3Uint256;
    slashesCount: number;
    totalDelegated: Web3Uint256;
    changedAt: number;
    jailedBefore: number;
    claimedAt: number;
}

export interface IVotingPower {
    votingSupply: number;
    votingPower: number;
}

export enum TProposalStatus {
    Pending,
    Active,
    Cancelled,
    Defeated,
    Succeeded,
    Queued,
    Expired,
    Executed
}

export interface IGovernanceProposal {
    id: string;
    proposer: string;
    status: TProposalStatus;
    targets: string[];
    values: string[];
    signatures: string[];
    inputs: string[];
    startBlock: string;
    endBlock: string;
    desc: string;
}