import {Button, Divider} from "antd";
import {observer} from "mobx-react";
import {ReactElement} from "react";
import {useBasStore} from "../../stores";
import {BigNumber} from "bignumber.js";
import {RelayHubSdk} from "@ankr.com/bas-relayhub-sdk";

const CROSS_CHAIN_BRIDGE_ABI = require('./CrossChainBridge.json')

const CHAPEL_BRIDGE_ADDRESS = '0x8d4ff6Ec7568D683172864cdA81eDE312Dc613c9';
const DEV_BRIDGE_ADDRESS = '0xef19228b501B0986Cb693BfaA08776705671045B';

export const BridgeNav = observer((): ReactElement => {
  return (
    <div>
      <Divider/>
      <Button size="large" type="primary" onClick={async () => {
        const amount = prompt("Input amount of tokens to transfer: ")
        if (!amount) return;
        const sdk = useBasStore().getBasSdk();
        const {web3} = sdk.getKeyProvider();
        const devBridge = new web3!.eth.Contract(CROSS_CHAIN_BRIDGE_ABI, DEV_BRIDGE_ADDRESS)
        const myAddress = sdk.getKeyProvider().getMyAddress()
        const inputData = devBridge.methods.deposit('97', myAddress).encodeABI();
        const tx = await sdk.getKeyProvider().sendTx({
          to: DEV_BRIDGE_ADDRESS,
          data: inputData,
          value: new BigNumber(amount).multipliedBy(10 ** 18).toString(10),
        })
        console.log(tx);
      }}>
        Deposit to bridge
      </Button>
      <Divider/>
      <Button size="large" type="primary" onClick={async () => {
        const txHash = prompt('Input transaction hash:')
        if (!txHash) return;
        const sdk = useBasStore().getBasSdk();
        const relayHubSdk = new RelayHubSdk()
        const {web3} = sdk.getKeyProvider();
        const receipt = await web3!.eth.getTransactionReceipt(txHash)
        if (!receipt) {
          throw new Error(`Can't find receipt for transaction hash: ${txHash}`)
        }
        const receiptProof = await relayHubSdk.createReceiptProof(web3!, receipt, 5)
        for (let i = 0; i < receiptProof.blockProofs.length; i += 1) {
          if (!receiptProof.blockProofs[i].startsWith('0x')) {
            receiptProof.blockProofs[i] = `0x${receiptProof.blockProofs[i]}`;
          }
        }
        console.log(receiptProof)
        await sdk.getKeyProvider().switchNetworkTo(97);
        const chapelBridge = new web3!.eth.Contract(CROSS_CHAIN_BRIDGE_ABI, CHAPEL_BRIDGE_ADDRESS);
        const inputData = chapelBridge.methods.withdraw(
          receiptProof.blockProofs,
          receiptProof.rawReceipt,
          receiptProof.proofPath,
          receiptProof.proofSiblings,
        ).encodeABI();
        const tx = await sdk.getKeyProvider().sendTx({
          to: CHAPEL_BRIDGE_ADDRESS,
          data: inputData,
        })
        console.log(tx);
      }}>
        Withdraw from bridge
      </Button>
    </div>
  );
})