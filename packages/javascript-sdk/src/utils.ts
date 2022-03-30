import {EventData} from "web3-eth-contract";

const compareTwoEventsFn = <T extends EventData>(a: T, b: T): number => {
  if (a.blockNumber !== b.blockNumber) {
    return a.blockNumber - b.blockNumber
  } else if (a.transactionIndex !== b.transactionIndex) {
    return a.transactionIndex - b.transactionIndex
  }
  return a.logIndex - b.logIndex;
}

export const sortEventData = <T extends EventData>(a: T[], b: T[] = [], c: T[] = []): T[] => {
  const fn = (a: EventData, b: EventData): number => {
    return compareTwoEventsFn(a, b)
  }
  return a.concat(b, c).sort(fn)
}

interface IHasEventData {
  event?: EventData;
}

export const sortHasEventData = <T extends IHasEventData>(a: T[], b: T[] = [], c: T[] = []): T[] => {
  const fn = (a: IHasEventData, b: IHasEventData): number => {
    return compareTwoEventsFn(a.event!, b.event!)
  }
  return a.concat(b, c).sort(fn)
}