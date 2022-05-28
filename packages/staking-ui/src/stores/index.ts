import {MobXProviderContext} from 'mobx-react'
import React from "react";

import {BasStore, LOCAL_CONFIG, DEV_CONFIG, makeDefaultConfig, CONFIGS} from "./BasStore";

let currentEnvironment = process.env.REACT_APP_ENVIRONMENT || '${REACT_APP_ENVIRONMENT}'

let config = LOCAL_CONFIG
if (currentEnvironment === 'local') {
  config = LOCAL_CONFIG
} else if (currentEnvironment === 'devnet') {
  config = DEV_CONFIG
}

// let force switch network using url params
if (window.location.search.length > 0) {
  const searchParams = Object.fromEntries(window.location.search.substring(1).split('&').map(v => v.split('=')));
  if (searchParams.config && CONFIGS[searchParams.config.toLowerCase()]) {
    config = CONFIGS[searchParams.config.toLowerCase()]
    currentEnvironment = 'url';
  }
}

console.log(`Current env is: ${currentEnvironment}`)

if (currentEnvironment === 'env') {
  config = makeDefaultConfig(Number('${CHAIN_ID}'), '${CHAIN_NAME}', '${CHAIN_RPC}', {
    homePage: "${EXPLORER_HOME_URL}",
    txUrl: "${EXPLORER_TX_URL}",
    addressUrl: "${EXPLORER_ADDRESS_URL}",
    blockUrl: "${EXPLORER_BLOCK_URL}",
  })
}

console.log(`Current config: ${JSON.stringify(config, null, 2)}`);
const basStore = new BasStore(config)
basStore.connectFromInjected().then(async () => {
  const currentAccount = basStore.getBasSdk().getKeyProvider().accounts;
  console.log(`Current account is: ${[currentAccount]}`)
})

export const useStores: any = () => {
  return React.useContext(MobXProviderContext)
}

export const useBasStore = (): BasStore => basStore