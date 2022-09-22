import jdn from '../assets/images/partners/jdn.png';
import tbwg from '../assets/images/partners/tbwg.png';
import tokenine from '../assets/images/partners/tokenine.png';
import iam from '../assets/images/partners/iam.png';
import jet from '../assets/images/partners/jet.png';
// import unknow from '../assets/images/partners/default.png';
import BigNumber from 'bignumber.js';

export const EXPLORER_URL = "https://blockscout.com/xdai/mainnet/{}";
export const MAIN_CHAIN_ID = 3501
export const TEST_CHAIN_ID = 3502
export const BLOCK_REWARD = new BigNumber("2097792000000000000000");
export const GWEI = 1e18;
export const VALIDATOR_WALLETS: Record<string, {name: string, image: string}> = {
    "0xa22fD0F35d2416eC293E2D00A8eB0c3Bc633Aa91": {
        name: "JDN",
        image: jdn
    },
    "0xCd4A92A21539Fd2b50d1ecabce89cCf7294100C8": {
        name: "TBWG",
        image: tbwg
    },
    "0x88Cf3c2a965e2636155bCEf7264B805E8f57EF97": {
        name: "TOKENINE",
        image: tokenine
    },
    "0xe8391988483355e6a8170AC10f5726D4868e5C68": {
        name: "IAM",
        image: iam
    },
    "0x6DE767908d0d792385200E30d66A5696B24f709c": {
        name: "JET",
        image: jet
    },
}