import {MobXProviderContext} from 'mobx-react'
import React from "react";

import {BasStore, LOCAL_CONFIG, DEV_CONFIG, makeDefaultConfig} from "./BasStore";

const currentEnvironment = process.env.REACT_APP_ENVIRONMENT || '${REACT_APP_ENVIRONMENT}';
// if (currentEnvironment === '${REACT_APP_ENVIRONMENT}') {
//   currentEnvironment = `${process.env.REACT_APP_ENVIRONMENT}` || 'devnet'
// }

console.log(`Current env is: ${currentEnvironment}`)

let config = LOCAL_CONFIG
if (currentEnvironment === 'devnet') {
  config = LOCAL_CONFIG
} else if (currentEnvironment === 'testnet') {
  config = DEV_CONFIG
}

if (currentEnvironment === 'env') {
  config = makeDefaultConfig(Number('${CHAIN_ID}'), '${CHAIN_NAME}', '${CHAIN_RPC}', {
    homePage: "${EXPLORER_HOME_URL}",
    txUrl: "${EXPLORER_TX_URL}",
    addressUrl: "${EXPLORER_ADDRESS_URL}",
    blockUrl: "${EXPLORER_BLOCK_URL}",
  })
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