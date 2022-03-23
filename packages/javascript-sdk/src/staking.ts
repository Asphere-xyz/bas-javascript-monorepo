import {KeyProvider} from "./provider";
import {IPendingTx, IValidator, Web3Address, Web3Uint256} from "./types";

export class Staking {

    constructor(
        private readonly keyProvider: KeyProvider
    ) {
    }

    public async getValidators(): Promise<IValidator[]> {
        const currentEpoch = await this.keyProvider.stakingContract!.methods.currentEpoch().call()
        return this.getValidatorsAtEpoch(currentEpoch)
    }

    public async getValidatorsAtEpoch(epoch: number): Promise<IValidator[]> {
        const activeValidators = await this.keyProvider.stakingContract!.methods.getValidators().call()
        const result: IValidator[] = []
        for (const address of activeValidators) {
            const status = await this.keyProvider.stakingContract!.methods.getValidatorStatusAtEpoch(address, epoch).call()
            result.push({
                validator: address,
                changedAt: status.changedAt,
                claimedAt: status.claimedAt,
                totalDelegated: status.totalDelegated,
                jailedBefore: status.jailedBefore,
                owner: status.ownerAddress,
                slashesCount: status.slashesCount,
                status: status.status,
            });
        }
        return result
    }

    public async delegateTo(validator: Web3Address, amount: Web3Uint256): Promise<IPendingTx> {
        const data = this.keyProvider.stakingContract!.methods
            .delegate(validator)
            .encodeABI()
        return this.keyProvider.sendTx({
            to: this.keyProvider.stakingAddress!,
            value: amount,
            data: data,
        })
    }

    public async undelegateFrom(validator: Web3Address, amount: Web3Uint256): Promise<IPendingTx> {
        const data = this.keyProvider.stakingContract!.methods
            .undelegate(validator, amount)
            .encodeABI()
        return this.keyProvider.sendTx({
            to: this.keyProvider.stakingAddress!,
            data: data,
        })
    }

    public async getStakingRewards(validator: Web3Address, delegator: Web3Address): Promise<Web3Uint256> {
        return this.keyProvider.stakingContract!.methods.getDelegatorFee(validator, delegator).call()
    }

    public async getMyStakingRewards(validator: Web3Address): Promise<Web3Uint256> {
        const [delegator] = this.keyProvider.accounts!
        return this.keyProvider.stakingContract!.methods.getDelegatorFee(validator, delegator).call()
    }

    public async getValidatorRewards(validator: Web3Address): Promise<Web3Uint256> {
        return this.keyProvider.stakingContract!.methods.getValidatorFee(validator).call()
    }

    public async getMyDelegatedAmount(validator: Web3Address): Promise<Web3Uint256> {
        const [currentAccount] = this.keyProvider.accounts!
        const result = await this.keyProvider.stakingContract!.methods
            .getValidatorDelegation(validator, currentAccount)
            .call()
        return result.delegatedAmount
    }
}