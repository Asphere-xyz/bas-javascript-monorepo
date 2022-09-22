import { MobXProviderContext } from "mobx-react";
import React from "react";

import {
  BasStore,
  LOCAL_CONFIG,
  DEV_CONFIG,
  METAAPES_CONFIG,
  JFIN_CONFIG,
  JFIN_TESTNET_CONFIG,
  MRFOX_CONFIG,
  makeDefaultConfig,
  CONFIGS,
} from "./BasStore";
import ModalStore from "./ModalStore";

let currentEnvironment =
  process?.env?.REACT_APP_ENVIRONMENT || "${REACT_APP_ENVIRONMENT}";

let config = LOCAL_CONFIG;

switch (currentEnvironment) {
  case "local":
    config = LOCAL_CONFIG;
    break;
  case "devnet":
    config = DEV_CONFIG;
    break;
  case "mrfox":
    config = MRFOX_CONFIG;
    break;
  case "jfin":
    config = JFIN_CONFIG;
    break;
  case "jfintest":
    config = JFIN_TESTNET_CONFIG;
    break;
  default:
    config = LOCAL_CONFIG;
    break;
}

// let force switch network using url params
if (window.location.search.length > 0) {
  const searchParams = Object.fromEntries(
    window.location.search
      .substring(1)
      .split("&")
      .map((v) => v.split("="))
  );
  if (searchParams.config && CONFIGS[searchParams.config.toLowerCase()]) {
    config = CONFIGS[searchParams.config.toLowerCase()];
    currentEnvironment = "url";
  }
}

// console.log(`Current env is: ${currentEnvironment}`)

if (currentEnvironment === "env") {
  config = makeDefaultConfig(
    Number("${CHAIN_ID}"),
    "${CHAIN_NAME}",
    "${CHAIN_RPC}",
    {
      homePage: "${EXPLORER_HOME_URL}",
      txUrl: "${EXPLORER_TX_URL}",
      addressUrl: "${EXPLORER_ADDRESS_URL}",
      blockUrl: "${EXPLORER_BLOCK_URL}",
    }
  );
}

// console.log(`Current config: ${JSON.stringify(config, null, 2)}`);
const basStore = new BasStore(config);
const modalStore = new ModalStore();

basStore.connectProvider();
basStore.listenAccountChange();
basStore.listenChainChange();

export const getCurrentEnv = () => {
  return currentEnvironment;
};

export const useStores: any = () => {
  return React.useContext(MobXProviderContext);
};

export const useBasStore = (): BasStore => basStore;
export const useModalStore = (): ModalStore => modalStore;
export const getConfig = () => config;
