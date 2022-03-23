import {
    IKeyProvider,
    IGovernanceProposal,
    IPendingTx,
    Web3Address,
    IVotingPower,
    TProposalStatus
} from "./types";
import {KeyProvider} from "./provider";
import {PastEventOptions} from "web3-eth-contract";
import BigNumber from "bignumber.js";

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
        const isDeployer = this.keyProvider.deployerProxyContract!.methods.isDeployer(account).call();
        if (isDeployer) {
            throw new Error(`Account ${account} is already deployer`)
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
        const isDeployer = this.keyProvider.deployerProxyContract!.methods.isDeployer(account).call();
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
        const events = await this.keyProvider.governanceContract!.getPastEvents('ProposalCreated', options) as any[],
            result: IGovernanceProposal[] = []
        for (const {returnValues} of events) {
            const state = await this.keyProvider.governanceContract!.methods.state(returnValues.proposalId).call()
            result.push({
                id: returnValues.proposalId,
                // @ts-ignore
                status: TProposalStatus[Number(state)],
                proposer: returnValues.proposer,
                targets: returnValues.targets,
                values: returnValues.values,
                signatures: returnValues.signatures,
                inputs: returnValues.calldatas,
                startBlock: returnValues.startBlock,
                endBlock: returnValues.endBlock,
                desc: returnValues.description,
            });
        }
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
            data = this.keyProvider.governanceContract!.methods.proposeWithCustomVotingPeriod(targets, values, inputs, builder.description, builder.votingPeriod);
        } else {
            data = this.keyProvider.governanceContract!.methods.propose(targets, values, inputs, builder.description);
        }
        return this.keyProvider.sendTx({to: this.keyProvider.governanceAddress!, data: data});
    }

    public async executeProposal(): Promise<IPendingTx> {
        throw new Error(`not implemented`);
    }
}