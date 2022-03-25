import {KeyProvider} from "./provider";
import {Web3Address} from "./types";

export class RuntimeUpgrade {

  constructor(
    private readonly keyProvider: KeyProvider
  ) {
  }

  public async upgradeRuntime(contract: Web3Address, byteCode: string, inputData: string = '0x') {
    console.log(contract);
    console.log(byteCode);
    console.log(inputData);
    this.keyProvider.isConnected();
  }
}