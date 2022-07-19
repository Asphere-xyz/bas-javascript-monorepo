import {Steps, Button, Divider} from "antd";
import {observer} from "mobx-react";
import {ReactElement, useState} from "react";
import {useBasStore} from "../../stores";
import {BigNumber} from "bignumber.js";
import {RelayHubSdk} from "@ankr.com/bas-relayhub-sdk";
import {waitForExpectedNetworkOrThrow} from "@ankr.com/bas-javascript-sdk";

const CROSS_CHAIN_BRIDGE_ABI = require('./CrossChainBridge.json')

const CHAPEL_BRIDGE_ADDRESS = '0x8d4ff6Ec7568D683172864cdA81eDE312Dc613c9';
const DEV_BRIDGE_ADDRESS = '0xef19228b501B0986Cb693BfaA08776705671045B';

export const BridgeNav = observer((): ReactElement => {
  const [step, setStep] = useState(0)
  const [confirmations, setConfirmations] = useState(0)
  const [transactionHash, setTransactionHash] = useState('')
  const CONFIRMATIONS_REQUIRED = 6;
  return (
    <div>
      <Divider/>
      <Steps direction="vertical" current={step}>
        <Steps.Step title="Lock funds in the bridge" description={<Button type="primary" onClick={async () => {
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
          setStep(1)
          const txReceipt = await tx.receipt
          console.log(txReceipt)
          setTransactionHash(txReceipt.transactionHash)
          setStep(2)
          const intervalId = setInterval(async () => {
            const currentBlockNumber = await web3!.eth.getBlockNumber()
            const confirmedBlocks = currentBlockNumber - txReceipt.blockNumber
            console.log(`confirmed: ${confirmedBlocks}/${CONFIRMATIONS_REQUIRED}`)
            if (confirmedBlocks >= CONFIRMATIONS_REQUIRED) {
              clearInterval(intervalId)
              setStep(3)
            }
            setConfirmations(confirmedBlocks)
          }, 1_000)
        }} disabled={step !== 0}>Deposit</Button>}/>
        <Steps.Step title="Mining transaction" description="It might take up to 1-2 minutes"/>
        <Steps.Step title="Waiting for confirmation"
                    description={`Confirmations blocks: ${confirmations}/${CONFIRMATIONS_REQUIRED}`}/>
        <Steps.Step title="Claim Peg tokens in BSC network" description={<Button type="primary" onClick={async () => {
          const relayHubSdk = new RelayHubSdk()
          const sdk = useBasStore().getBasSdk();
          const {web3} = sdk.getKeyProvider();
          const receipt = await web3!.eth.getTransactionReceipt(transactionHash)
          if (!receipt) {
            throw new Error(`Can't find receipt for transaction hash: ${transactionHash}`)
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
          setStep(4)
        }} disabled={step !== 3}>Switch network and claim</Button>}/>
        <Steps.Step title="All done"/>
      </Steps>
      <Divider/>
    </div>
  );
})