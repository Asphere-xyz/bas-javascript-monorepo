import {KeyProvider} from "./provider";
import {
  IDelegatorDelegation,
  IDelegatorOneOfEvent,
  IPendingTx,
  IValidator,
  Web3Address,
  Web3Uint256
} from "./types";
import BigNumber from "bignumber.js";
import {sortEventData, sortHasEventData} from "./utils";
import {EventData} from "web3-eth-contract";

export class Staking {

  constructor(
    private readonly keyProvider: KeyProvider
  ) {
  }

  public async getAllValidatorsAddresses(): Promise<Web3Address[]> {
    const validatorAddedEvents = await this.keyProvider.stakingContract!.getPastEvents('ValidatorAdded', {
        fromBlock: 'earliest',
        toBlock: 'latest',
      }),
      validatorRemovedEvents = await this.keyProvider.stakingContract!.getPastEvents('ValidatorRemoved', {
        fromBlock: 'earliest',
        toBlock: 'latest',
      })
    const validators = new Set<Web3Address>()
    for (const log of sortEventData(validatorAddedEvents, validatorRemovedEvents)) {
      const {validator} = log.returnValues
      if (log.event === 'ValidatorAdded') {
        validators.add(validator);
      } else if (log.event === 'ValidatorRemoved') {
        validators.delete(validator);
      }
    }
    return Array.from(validators)
  }

  public async getAllValidators(epoch?: number): Promise<IValidator[]> {
    const validators = await this.getAllValidatorsAddresses()
    return await this.loadValidatorsInfo(validators, epoch)
  }

  public async getTotalDelegatedAmount(): Promise<BigNumber> {
    let result = new BigNumber('0')
    for (const validator of await this.getAllValidators()) {
      result = result.plus(new BigNumber(validator.totalDelegated))
    }
    return result.dividedBy(10 ** 18);
  }

  public async getDelegatorDelegatedAmount(delegator: Web3Address): Promise<BigNumber> {
    const delegations = await this.getDelegationHistory({delegator}),
      unDelegations = await this.getUnDelegationHistory({delegator})
    let result = new BigNumber('0')
    for (const e of sortHasEventData(delegations, unDelegations)) {
      if (e.event!.event === 'Delegated') {
        result = result.plus(e.amount)
      } else if (e.event!.event === 'Undelegated') {
        result = result.minus(e.amount)
      }
    }
    return result.dividedBy(10 ** 18)
  }

  public async getActiveValidatorsAddresses(): Promise<Web3Address[]> {
    return await this.keyProvider.stakingContract!.methods.getValidators().call()
  }

  public async getActiveValidators(epoch?: number): Promise<IValidator[]> {
    const activeValidators = await this.getActiveValidatorsAddresses()
    return this.loadValidatorsInfo(activeValidators, epoch);
  }

  public async countValidators(): Promise<{ active: number; total: number; }> {
    const allValidators = await this.getAllValidatorsAddresses(),
      activeValidators = await this.getActiveValidatorsAddresses()
    return {active: activeValidators.length, total: allValidators.length}
  }

  public async getValidatorHistory(validator: Web3Address, beforeEpoch?: number, limit: number = 30): Promise<IValidator[]> {
    if (!beforeEpoch) {
      beforeEpoch = await this.keyProvider.getCurrentEpoch()
    }
    const promises: Promise<IValidator>[] = []
    for (let i = beforeEpoch - limit; i <= beforeEpoch; i++) {
      promises.push(this.loadValidatorInfo(validator, i))
    }
    return await Promise.all(promises)
  }

  private async loadValidatorsInfo(validators: Web3Address[], epoch?: number): Promise<IValidator[]> {
    return await Promise.all(validators.map(v => this.loadValidatorInfo(v, epoch)))
  }

  private async loadValidatorInfo(validator: Web3Address, epoch?: number): Promise<IValidator> {
    let status: any;
    if (epoch) {
      status = await this.keyProvider.stakingContract!.methods.getValidatorStatusAtEpoch(validator, epoch).call()
    } else {
      status = await this.keyProvider.stakingContract!.methods.getValidatorStatus(validator).call()
    }
    return {
      validator: validator,
      changedAt: status.changedAt,
      claimedAt: status.claimedAt,
      totalDelegated: status.totalDelegated,
      jailedBefore: status.jailedBefore,
      owner: status.ownerAddress,
      slashesCount: status.slashesCount,
      status: status.status,
      commissionRate: status.commissionRate,
      totalRewards: status.totalRewards,
    };
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

  public async getDelegationHistory(filter: { validator?: Web3Address; delegator?: Web3Address } = {}): Promise<IDelegatorDelegation[]> {
    const events = await this.keyProvider.stakingContract!.getPastEvents('Delegated', {
      fromBlock: 'earliest',
      toBlock: 'latest',
      filter: filter,
    })
    return events.map((event: EventData): IDelegatorDelegation => {
      const {validator, staker, amount, epoch} = event.returnValues
      return {event, validator, staker, amount, epoch}
    })
  }

  public async getUnDelegationHistory(filter: { validator?: Web3Address; delegator?: Web3Address } = {}): Promise<IDelegatorDelegation[]> {
    const events = await this.keyProvider.stakingContract!.getPastEvents('Undelegated', {
      fromBlock: 'earliest',
      toBlock: 'latest',
      filter: filter,
    })
    return events.map((event: EventData): IDelegatorDelegation => {
      const {validator, staker, amount, epoch} = event.returnValues
      return {event, validator, staker, amount, epoch}
    })
  }

  public async getClaimHistory(filter: { validator?: Web3Address; delegator?: Web3Address } = {}): Promise<IDelegatorDelegation[]> {
    const events = await this.keyProvider.stakingContract!.getPastEvents('Claimed', {
      fromBlock: 'earliest',
      toBlock: 'latest',
      filter: filter,
    })
    return events.map((event: EventData): IDelegatorDelegation => {
      const {validator, staker, amount, epoch} = event.returnValues
      return {event, validator, staker, amount, epoch}
    })
  }

  public async getAllEventsHistory(filter: { validator?: Web3Address; delegator?: Web3Address } = {}): Promise<IDelegatorOneOfEvent[]> {
    const [delegation, unDelegation, claim] = await Promise.all([
      this.getDelegationHistory(filter),
      this.getUnDelegationHistory(filter),
      this.getClaimHistory(filter),
    ])
    return sortHasEventData(delegation, unDelegation, claim).map((item): IDelegatorOneOfEvent => {
      const result: IDelegatorOneOfEvent = {}
      if (item.event!.event === 'Delegated') {
        result.delegation = item
      } else if (item.event!.event === 'Undelegated') {
        result.undelegation = item
      } else if (item.event!.event === 'Claimed') {
        result.claim = item
      }
      return result
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

  public async getMyActiveDelegations(): Promise<IDelegatorDelegation[]> {
    return this.getActiveDelegations(this.keyProvider.getMyAddress());
  }

  public async getActiveDelegations(address: Web3Address): Promise<IDelegatorDelegation[]> {
    const delegationHistory = await this.getDelegationHistory({
      delegator: address,
    })
    const lastDelegations = delegationHistory.reduce((result: Record<number, IDelegatorDelegation>, item: IDelegatorDelegation) => {
      return {...result, [`${item.validator + '/' + item.epoch}`]: item}
    }, {});
    return Object.values(lastDelegations)
  }

  public async getMyAvailableReDelegateAmount(): Promise<BigNumber> {
    return this.getAvailableReDelegateAmount(this.keyProvider.getMyAddress());
  }

  public async getAvailableReDelegateAmount(address: Web3Address): Promise<BigNumber> {
    return new BigNumber('0')
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

  public async releaseValidatorFromJail(validator: Web3Address): Promise<IPendingTx> {
    const data = this.keyProvider.stakingContract!.methods
      .releaseValidatorFromJail(validator)
      .encodeABI()
    return this.keyProvider.sendTx({
      to: this.keyProvider.stakingAddress!,
      data: data,
    })
  }
}