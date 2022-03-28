import {action, makeAutoObservable} from "mobx";
import {DependencyList, useEffect, useMemo} from "react";

export type LocalDataStoreDataHandler<T> = () => Promise<T>;

export class FetchDataStore<T> {

  public item?: T;

  public isLoading = false;

  public constructor( private readonly dataHandler: LocalDataStoreDataHandler<T>) {
    makeAutoObservable(this)
  }

  @action
  async fetchItem(): Promise<void> {
    this.isLoading = true;
    this.item = await this.dataHandler();
    this.isLoading = false
  }

  @action
  removeItem(): void {
    this.item = undefined;
  }
  
}

export const useLocalFetchDataStore = <T>(dataHandler: LocalDataStoreDataHandler<T>, deps: DependencyList | undefined = []): FetchDataStore<T> => {
  const store = useMemo(() => {
    return new FetchDataStore<T>(dataHandler);
      // eslint-disable-next-line
    }, deps);
    useEffect(() => {
      store.fetchItem();
      return () => store.removeItem()
    }, [store]);
    return store;
}
