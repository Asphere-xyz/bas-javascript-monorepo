import {EventData} from "web3-eth-contract";

export const sortEventData = <T extends EventData>(a: T[], b: T[] = [], c: T[] = []): T[] => {
  const fn = (a: EventData, b: EventData): number => {
    if (a.blockNumber == b.blockNumber) {
      return a.transactionIndex - b.transactionIndex
    } else {
      return a.blockNumber - b.blockNumber
    }
  }
  return a.concat(b, c).sort(fn)
}

interface IHasEventData {
  event?: EventData;
}

export const sortHasEventData = <T extends IHasEventData>(a: T[], b: T[] = [], c: T[] = []): T[] => {
  const fn = (a: IHasEventData, b: IHasEventData): number => {
    if (a.event!.blockNumber == b.event!.blockNumber) {
      return a.event!.transactionIndex - b.event!.transactionIndex
    } else {
      return a.event!.blockNumber - b.event!.blockNumber
    }
  }
  return a.concat(b, c).sort(fn)
}