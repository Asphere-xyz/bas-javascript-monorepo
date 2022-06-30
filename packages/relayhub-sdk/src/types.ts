
export interface IReceiptProof {
  blockProofs: string[];
  rawReceipt: string;
  proofPath: string;
  proofSiblings: string;
  blockHash: string;
  receiptHash: string;
}