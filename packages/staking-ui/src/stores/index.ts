import {MobXProviderContext} from 'mobx-react'
import { IValueMap } from 'mobx-react/dist/types/IValueMap';
import React from "react";

import {BasStore, DEVNET_CONFIG, TESTNET_CONFIG} from "./BasStore";

const currentEnvironment = process.env.REACT_APP_ENVIRONMENT || 'devnet';

console.log(`Current env is: ${currentEnvironment}`)

let config = DEVNET_CONFIG
if (currentEnvironment === 'devnet') {
  config = DEVNET_CONFIG
} else if (currentEnvironment === 'testnet') {
  config = TESTNET_CONFIG
}

const basStore = new BasStore(config)
basStore.connectFromInjected().then(async () => {
  const currentAccount = basStore.getBasSdk().getKeyProvider().accounts;
  console.log(`Current account is: ${[currentAccount]}`)
})

export const useStores: any = () => {
  return React.useContext(MobXProviderContext)
}

export const useChilizStore = (): BasStore => basStore