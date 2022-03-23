import {IConfig} from "./config";
import {Governance} from "./governance";
import {KeyProvider} from "./provider";
import {Staking} from "./staking";

export class BasSdk {

    private keyProvider?: KeyProvider;
    private staking?: Staking;
    private governance?: Governance;

    constructor(
        private readonly config: IConfig
    ) {
    }

    public async connect(): Promise<void> {
        const keyProvider = new KeyProvider(this.config)
        // connect web3
        await keyProvider.connectFromInjected()
        // init providers
        this.keyProvider = keyProvider
        this.staking = new Staking(keyProvider)
        this.governance = new Governance(keyProvider)
    }

    public getKeyProvider(): KeyProvider {
        return this.keyProvider!;
    }

    public getStaking(): Staking {
        return this.staking!;
    }

    public getGovernance(): Governance {
        return this.governance!;
    }
}