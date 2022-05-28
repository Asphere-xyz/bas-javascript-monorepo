import {
  IKeyProvider,
  IGovernanceProposal,
  IPendingTx,
  Web3Address,
  IVotingPower,
  TGovernanceProposalStatus, IGovernanceVote, TGovernanceVoteType
} from "./types";
import {KeyProvider} from "./provider";
import {PastEventOptions} from "web3-eth-contract";
import BigNumber from "bignumber.js";
import {keccak256} from "web3-utils";
import {sortEventData} from "./utils";

export class ProposalBuilder {

  public actions: {
    target: string;
    inputData: string;
    value: string;
  }[] = []

  public votingPeriod?: string;
  public description?: string;

  constructor(
    private readonly keyProvider: IKeyProvider,
  ) {
  }

  public setDescription(description: string): ProposalBuilder {
    this.description = description
    return this
  }

  public setVotingPeriod(votingPeriod: string): ProposalBuilder {
    this.votingPeriod = votingPeriod
    return this
  }

  public async addDeployer(account: Web3Address): Promise<ProposalBuilder> {
    const isDeployer = await this.keyProvider.deployerProxyContract!.methods.isDeployer(account).call();
    if (isDeployer) {
      throw new Error(`Account ${account} is already a deployer`)
    }
    const inputData = this.keyProvider.deployerProxyContract!.methods.addDeployer(account).encodeABI()
    this.actions.push({
      target: this.keyProvider.deployerProxyAddress!,
      inputData: inputData,
      value: '0x00',
    });
    return this
  }

  public async removeDeployer(account: Web3Address): Promise<ProposalBuilder> {
    const isDeployer = await this.keyProvider.deployerProxyContract!.methods.isDeployer(account).call();
    if (!isDeployer) {
      throw new Error(`Account ${account} is not a deployer`)
    }
    const inputData = this.keyProvider.deployerProxyContract!.methods.removeDeployer(account).encodeABI()
    this.actions.push({
      target: this.keyProvider.deployerProxyAddress!,
      inputData: inputData,
      value: '0x00',
    });
    return this
  }

  public async addValidator(account: Web3Address): Promise<ProposalBuilder> {
    const isValidator = await this.keyProvider.stakingContract!.methods.isValidator(account).call();
    if (isValidator) {
      throw new Error(`Account ${account} is already a validator`)
    }
    const inputData = this.keyProvider.stakingContract!.methods.addValidator(account).encodeABI()
    this.actions.push({
      target: this.keyProvider.stakingAddress!,
      inputData: inputData,
      value: '0x00',
    });
    return this
  }

  public async removeValidator(account: Web3Address): Promise<ProposalBuilder> {
    const isValidator = await this.keyProvider.stakingContract!.methods.isValidator(account).call();
    if (!isValidator) {
      throw new Error(`Account ${account} is not a validator`)
    }
    const inputData = this.keyProvider.stakingContract!.methods.removeValidator(account).encodeABI()
    this.actions.push({
      target: this.keyProvider.stakingAddress!,
      inputData: inputData,
      value: '0x00',
    });
    return this
  }

  public async activateValidator(account: Web3Address): Promise<ProposalBuilder> {
    const isValidator = await this.keyProvider.stakingContract!.methods.isValidator(account).call();
    if (!isValidator) {
      throw new Error(`Account ${account} is not a validator`)
    }
    const inputData = this.keyProvider.stakingContract!.methods.activateValidator(account).encodeABI()
    this.actions.push({
      target: this.keyProvider.stakingAddress!,
      inputData: inputData,
      value: '0x00',
    });
    return this
  }

  public async disableValidator(account: Web3Address): Promise<ProposalBuilder> {
    const isValidator = await this.keyProvider.stakingContract!.methods.isValidator(account).call();
    if (!isValidator) {
      throw new Error(`Account ${account} is not a validator`)
    }
    const inputData = this.keyProvider.stakingContract!.methods.disableValidator(account).encodeABI()
    this.actions.push({
      target: this.keyProvider.stakingAddress!,
      inputData: inputData,
      value: '0x00',
    });
    return this
  }

  public async upgradeRuntime(systemContract: Web3Address, byteCode: string): Promise<ProposalBuilder> {
    const inputData = this.keyProvider.runtimeUpgradeContract!.methods.upgradeSystemSmartContract(systemContract, byteCode).encodeABI()
    this.actions.push({
      target: this.keyProvider.runtimeUpgradeAddress!,
      inputData: inputData,
      value: '0x00',
    });
    return this
  }
}

export class Governance {

  constructor(
    private readonly keyProvider: KeyProvider
  ) {
  }

  public async getVotingPowers(validators: Web3Address[]): Promise<Record<Web3Address, IVotingPower>> {
    const result: Record<Web3Address, IVotingPower> = {}
    const votingSupply = await this.keyProvider.governanceContract!.methods.getVotingSupply().call()
    for (const validator of validators) {
      const votingPower = await this.keyProvider.governanceContract!.methods.getVotingPower(validator).call()
      result[validator] = {
        votingSupply: new BigNumber(votingSupply).dividedBy(10 ** 18).toNumber(),
        votingPower: new BigNumber(votingPower).dividedBy(10 ** 18).toNumber(),
      }
    }
    return result
  }

  public async getProposals(options: PastEventOptions = {}): Promise<IGovernanceProposal[]> {
    const events = await this.keyProvider.governanceContract!.getPastEvents('ProposalCreated', options),
      result: IGovernanceProposal[] = []
    const castVotes = sortEventData(
      await this.keyProvider.governanceContract!.getPastEvents('VoteCast', options),
      await this.keyProvider.governanceContract!.getPastEvents('VoteCastWithParams', options)
    )
    const proposalVotes: Record<string, IGovernanceVote[]> = {};
    for (const vote of castVotes) {
      const {proposalId, reason, support, voter, weight} = vote.returnValues;
      if (!proposalVotes[proposalId]) proposalVotes[proposalId] = [];
      let voteType: TGovernanceVoteType = 'ABSTAIN'
      if (support === '0') {
        voteType = 'AGAINST'
      } else if (support === '1') {
        voteType = 'FOR'
      }
      proposalVotes[proposalId].push({
        type: voteType,
        blockNumber: vote.blockNumber,
        reason,
        voterAddress: voter,
        weight: new BigNumber(weight).dividedBy(10 ** 18),
        transactionHash: vote.transactionHash,
      });
    }
    for (const {blockNumber, returnValues} of events) {
      const state = await this.keyProvider.governanceContract!.methods.state(returnValues.proposalId).call()
      const quorumRequired = await this.keyProvider.governanceContract!.methods
        .quorum(blockNumber)
        .call();
      const bigQuorum = new BigNumber(quorumRequired).dividedBy(10 ** 18);
      const bigPower = bigQuorum.multipliedBy(3).dividedBy(2);
      const voteDistribution: Record<TGovernanceVoteType, BigNumber> = {
        'AGAINST': new BigNumber('0'),
        'FOR': new BigNumber('0'),
        'ABSTAIN': new BigNumber('0'),
      };
      for (const vote of proposalVotes[returnValues.proposalId] || []) {
        if (!voteDistribution[vote.type]) {
          continue;
        }
        voteDistribution[vote.type] = voteDistribution[vote.type].plus(vote.weight);
      }
      result.push({
        id: returnValues.proposalId,
        // @ts-ignore
        status: TGovernanceProposalStatus[Number(state)],
        proposer: returnValues.proposer,
        targets: returnValues.targets,
        values: returnValues.values,
        signatures: returnValues.signatures,
        inputs: returnValues.calldatas,
        startBlock: returnValues.startBlock,
        endBlock: returnValues.endBlock,
        desc: returnValues.description,
        votes: proposalVotes[returnValues.proposalId] || [],
        quorumRequired: bigQuorum,
        totalPower: bigPower,
        voteDistribution: voteDistribution,
      });
    }
    console.log(JSON.stringify(result, null, 2))
    return result
  }

  public createProposal(description?: string, votingPeriod?: string): ProposalBuilder {
    const builder = new ProposalBuilder(this.keyProvider)
    if (description) {
      builder.setDescription(description)
    }
    if (votingPeriod) {
      builder.setVotingPeriod(votingPeriod)
    }
    return builder
  }

  public async sendProposal(builder: ProposalBuilder): Promise<IPendingTx> {
    const targets = builder.actions.map((a) => a.target),
      inputs = builder.actions.map((a) => a.inputData),
      values = builder.actions.map((a) => a.value);
    let data: string
    if (builder.votingPeriod) {
      data = this.keyProvider.governanceContract!.methods.proposeWithCustomVotingPeriod(targets, values, inputs, builder.description, builder.votingPeriod).encodeABI();
    } else {
      data = this.keyProvider.governanceContract!.methods.propose(targets, values, inputs, builder.description).encodeABI();
    }
    return this.keyProvider.sendTx({to: this.keyProvider.governanceAddress!, data: data});
  }

  public async voteForProposal(id: string): Promise<IPendingTx> {
    const data = this.keyProvider.governanceContract!.methods
      .castVote(id, '1')
      .encodeABI()
    return await this.keyProvider.sendTx({
      to: this.keyProvider.governanceAddress!,
      data: data,
    })
  }

  public async voteAgainstProposal(id: string): Promise<IPendingTx> {
    const data = this.keyProvider.governanceContract!.methods
      .castVote(id, '0')
      .encodeABI()
    return await this.keyProvider.sendTx({
      to: this.keyProvider.governanceAddress!,
      data: data,
    })
  }

  public async executeProposal(proposal: IGovernanceProposal): Promise<IPendingTx> {
    // noinspection JSVoidFunctionReturnValueUsed,TypeScriptValidateJSTypes
    const data = this.keyProvider.governanceContract!.methods
      .execute(proposal.targets, proposal.values, proposal.inputs, keccak256(proposal.desc))
      .encodeABI();
    return await this.keyProvider.sendTx({
      to: this.keyProvider.governanceAddress!,
      data: data,
    })
  }
}