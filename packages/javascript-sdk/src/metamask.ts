import Web3 from "web3";
import {numberToHex} from "web3-utils";
import {IConfig} from "./config";
import {IPendingTx} from "./types";

export const waitForExpectedNetworkOrThrow = async (web3: Web3, config: IConfig): Promise<void> => {
  if (!web3.givenProvider.request) {
    throw new Error(`Wallet doesn't support switching to the ${config.chainName} network, please switch it manually`);
  }
  try {
    await web3.givenProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{chainId: numberToHex(config.chainId)}],
    });
  } catch (error) {
    // This error code indicates that the chain has not been added to MetaMask.
    if ((error as any).code === 4902) {
      await tryAddMetaMaskNetwork(web3, config);
      throw new Error(`Network for ${config.chainName} is not configured in your MetaMask`);
    }
    throw new Error(`Unable to switch network to ${config.chainName}`);
  }
}

export const tryAddMetaMaskNetwork = async (web3: Web3, config: IConfig): Promise<boolean> => {
  try {
    await web3.givenProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{chainId: numberToHex(config.chainId)}],
    });
    return true
  } catch (switchError) {
    if ((switchError as any).code !== 4902) {
      console.error(switchError)
      return false
    }
  }
  try {
    await web3.givenProvider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: numberToHex(config.chainId),
          chainName: config.chainName,
          rpcUrls: [config.rpcUrl],
        },
      ],
    });
    return true
  } catch (addError) {
    console.error(addError)
  }
  return false
}

export const sendTransactionAsync = async (
  web3: Web3,
  sendOptions: {
    from: string;
    to: string;
    data?: string;
    gasLimit?: string;
    value?: string;
    nonce?: number;
  }
): Promise<IPendingTx> => {
  const gasPrice = await web3.eth.getGasPrice();
  console.log('Gas Price: ' + gasPrice);
  let nonce = sendOptions.nonce;
  if (!nonce) {
    nonce = await web3.eth.getTransactionCount(sendOptions.from);
  }
  console.log('Nonce: ' + nonce);
  const chainId = await web3.eth.getChainId()
  const tx = {
    from: sendOptions.from,
    to: sendOptions.to,
    value: numberToHex(sendOptions.value || '0'),
    gas: numberToHex(sendOptions.gasLimit || '1000000'),
    gasPrice: gasPrice,
    data: sendOptions.data,
    nonce: nonce,
    chainId: chainId,
  };
  const gasEstimation = await web3.eth.estimateGas(tx);
  console.log(`Gas estimation is: ${gasEstimation}`);
  if (sendOptions.gasLimit && Number(gasEstimation) > Number(sendOptions.gasLimit)) {
    throw new Error(`Gas estimation exceeds possible limit (${Number(gasEstimation)} > ${Number(sendOptions.gasLimit)})`);
  }
  console.log('Sending transaction via Web3: ', tx);
  return new Promise((resolve, reject) => {
    const promise = web3.eth.sendTransaction(tx);
    promise.once('transactionHash', async (transactionHash: string) => {
      console.log(`Just signed transaction has is: ${transactionHash}`);
      const rawTx = await web3.eth.getTransaction(transactionHash);
      console.log(`Found transaction in node: `, JSON.stringify(rawTx, null, 2),);
      resolve({transactionHash: transactionHash, receipt: promise,});
    }).catch(reject);
  });
}