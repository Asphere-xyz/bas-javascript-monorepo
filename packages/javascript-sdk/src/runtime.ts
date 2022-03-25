import {KeyProvider} from "./provider";
import {IPendingTx, Web3Address} from "./types";

export class RuntimeUpgrade {

  constructor(
    private readonly keyProvider: KeyProvider
  ) {
  }

  public async upgradeRuntime(contract: Web3Address, byteCode: string, applyFunction: string = '0x'): Promise<IPendingTx> {
    const data = this.keyProvider.runtimeUpgradeContract?.methods
      .upgradeSystemSmartContract(contract, byteCode, applyFunction)
      .encodeABI()
    return this.keyProvider.sendTx({
      to: this.keyProvider.runtimeUpgradeAddress!,
      data: data,
    })
  }
}