const DEFUALT_DIFFICULTY = 3;
import { _Block } from "./Src/interfaces/Blockchain/_Block";
export const config: { MINE_RATE: number; GENESIS_DATA: _Block; DEFUALT_BALANCE : number} = {
  MINE_RATE: 1000,
  GENESIS_DATA: {
    hash: "DEXhash",
    lastHash: "dexLastHash",
    nonce: 0,
    difficulty: DEFUALT_DIFFICULTY,
    timestamp: 0,
    data: ["DEX-BlockChain"],
  },
  DEFUALT_BALANCE : 0
};
