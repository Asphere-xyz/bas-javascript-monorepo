import { Web3Uint256, Web3Address } from "@ankr.com/bas-javascript-sdk";

export interface IDelegatedAssetsData {
  amount: Web3Uint256;
  validator: Web3Address;
  staker: Web3Address;
  transactionHash: string;
}