interface IMyTransactionHistory {
  type: string;
  amount: number;
  validatorMask: {
    name: string;
    image: string;
    validator: string;
  };
  event?: IEventData;
  validator: Web3Address;
  staker: Web3Address;
  amount: Web3Uint256;
  epoch: number;
}
