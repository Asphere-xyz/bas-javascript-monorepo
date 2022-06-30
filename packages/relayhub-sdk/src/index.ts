import {BaseTrie} from 'merkle-patricia-tree'
import Web3 from 'web3'
import {TransactionReceipt} from 'web3-core'
import {hexToNumber, padLeft, numberToHex} from "web3-utils"
import {rlp, toBuffer} from "ethereumjs-util"
import {IReceiptProof} from "./types";

const sendJsonRpcRequest = async (web3: Web3, data: any) => {
  return new Promise((resolve, reject) => {
    (<any>web3.currentProvider).send(data, (error: Error, result: any) => {
      if (error) return reject(error);
      if (result.error) return reject(result.error)
      resolve(result.result);
    })
  })
}

const isTypedReceipt = (receipt: any) => {
  if (!receipt.type) return false;
  const hexType = typeof receipt.type === 'number' ? numberToHex(receipt.type) : receipt.type;
  return receipt.status != null && hexType !== "0x0" && hexType !== "0x";
}

const getReceiptBytes = (receipt: any) => {
  let encodedData = rlp.encode([
    toBuffer(hexToNumber(receipt.status ? 1 : 0)),
    toBuffer(hexToNumber(receipt.cumulativeGasUsed)),
    toBuffer(receipt.logsBloom),
    // encoded log array
    receipt.logs.map((l: any) => {
      // [address, [topics array], data]
      return [
        toBuffer(l.address), // convert address to buffer
        l.topics.map(toBuffer), // convert topics to buffer
        toBuffer(l.data), // convert data to buffer
      ];
    }),
  ]);
  if (isTypedReceipt(receipt)) {
    encodedData = Buffer.concat([toBuffer(receipt.type), encodedData]);
  }
  return encodedData;
}

const blockToRlp = (block: any) => {
  return rlp.encode([
    toBuffer(block.parentHash),
    toBuffer(block.sha3Uncles),
    toBuffer(block.miner),
    toBuffer(block.stateRoot),
    toBuffer(block.transactionsRoot),
    toBuffer(block.receiptsRoot),
    toBuffer(block.logsBloom),
    Number(block.difficulty),
    Number(block.number),
    Number(block.gasLimit),
    Number(block.gasUsed),
    Number(block.timestamp),
    toBuffer(block.extraData),
    toBuffer(block.mixHash),
    padLeft(block.nonce, 8),
  ])
}

export class RelayHubSdk {

  constructor() {
  }

  async createReceiptProof(web3: Web3, receipt: TransactionReceipt, confirmations: number = 5): Promise<IReceiptProof> {
    const block = await web3.eth.getBlock(receipt.blockNumber)
    const receiptKey = rlp.encode(hexToNumber(receipt.transactionIndex));

    // fetch receipts
    let receiptsPromises: Promise<TransactionReceipt>[] = []
    for (const txHash of block.transactions) {
      receiptsPromises.push(web3.eth.getTransactionReceipt(txHash));
    }
    let receipts = await Promise.all(receiptsPromises)
    receipts = receipts.sort((a, b) => {
      return a.transactionIndex - b.transactionIndex;
    })
    receipts = (<any[]>receipts).map(r => {
      if (!r.type) r.type = 0
      if (typeof r.status === 'boolean') {
        r.status = Number(r.status)
      }
      return r
    })
    console.log(receipts)

    // build receipt trie
    const trie = new BaseTrie();
    for (const receipt of receipts) {
      const path = rlp.encode(hexToNumber(receipt.transactionIndex)),
        data = getReceiptBytes(receipt);
      await trie.put(path, data)
    }
    const foundPath = await trie.findPath(receiptKey, true)
    if (foundPath.remaining.length > 0) {
      throw new Error(`Can't find node in the trie`)
    }
    if (trie.root.toString('hex') !== block.receiptsRoot.substr(2)) {
      throw new Error(`Incorrect receipts root: ${trie.root.toString('hex')} != ${block.receiptsRoot.substr(2)}`)
    }

    // create proofs
    let blockProofs = [blockToRlp(block).toString('hex')];
    for (let i = 1; i < confirmations; i++) {
      const nextBlock = await web3.eth.getBlock(block.number + i)
      blockProofs.push('0x' + blockToRlp(nextBlock).toString('hex'));
    }
    let rawReceipt: string;
    if (isTypedReceipt(receipt)) {
      rawReceipt = '0x' + foundPath.node!.value!.toString('hex');
    } else {
      rawReceipt = '0x' + foundPath.node!.value!.toString('hex');
    }
    const proofPath = '0x' + Buffer.concat([Buffer.from('00', 'hex'), receiptKey]).toString('hex')
    const proofSiblings = '0x' + rlp.encode(foundPath.stack.map(s => s.raw())).toString('hex');

    return {
      blockProofs,
      rawReceipt,
      proofPath,
      proofSiblings,
      blockHash: block.hash,
      receiptHash: block.receiptsRoot,
    };
  }
}