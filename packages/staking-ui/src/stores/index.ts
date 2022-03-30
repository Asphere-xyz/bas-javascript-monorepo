import {MobXProviderContext} from 'mobx-react'
import React from "react";

import {BasStore, LOCAL_CONFIG, DEV_CONFIG} from "./BasStore";

const currentEnvironment = process.env.REACT_APP_ENVIRONMENT || 'devnet';

console.log(`Current env is: ${currentEnvironment}`)

let config = LOCAL_CONFIG
if (currentEnvironment === 'devnet') {
  config = LOCAL_CONFIG
} else if (currentEnvironment === 'testnet') {
  config = DEV_CONFIG
}

const basStore = new BasStore(config)
basStore.connectFromInjected().then(async () => {
  const currentAccount = basStore.getBasSdk().getKeyProvider().accounts;
  console.log(`Current account is: ${[currentAccount]}`)
})

export const useStores: any = () => {
  return React.useContext(MobXProviderContext)
}

export const useBasStore = (): BasStore => basStore