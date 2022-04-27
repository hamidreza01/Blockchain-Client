const DEFUALT_DIFFICULTY = 3;
import { _Block } from "./Src/interfaces/Blockchain/_Block";
import { _Transaction } from "./Src/interfaces/Blockchain/_Transaction";
const ADMIN = {
  httpIP : `localhost:45451` 
}
const REWARD_TRANSACTION  = {
  address : '**DPX Blockchain**'
}
const REWARD = 10;
export const config: {
  NODE_PORT : number,
  MINE_RATE: number;
  ADMIN : {},
  GENESIS_DATA: _Block;
  DEFUALT_BALANCE: number;
  ROOT_URL: string;
  ROOT_PORT: number;
  REWARD_TRANSACTION : {
    address : string
  };
  REWARD: number;
} = {
  NODE_PORT : 8765,
  ADMIN,
  MINE_RATE: 1000 * 60 * 10,
  ROOT_URL: "127.0.0.1",
  ROOT_PORT: 3001,
  GENESIS_DATA: {
    hash: "DEFAULT-DPX-GENESIS-HASH",
    lastHash: "DEFAULT-DPX-LAST-HASH",
    nonce: 0,
    difficulty: DEFUALT_DIFFICULTY,
    timestamp: 0,
    data: {},
  },
  DEFUALT_BALANCE: 0,
  REWARD_TRANSACTION,
  REWARD,
};
