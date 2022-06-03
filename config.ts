const DEFUALT_DIFFICULTY = 10;
import { _Block } from "./Src/interfaces/Blockchain/_Block";
import { _Transaction } from "./Src/interfaces/Blockchain/_Transaction";
const ADMIN = {
  httpIP: `localhost:45451`,
};
const REWARD_TRANSACTION = {
  address: "**DPX Blockchain**",
};
const REWARD = 10;
export const config = {
  NODE_PORT: 1414,
  ADMIN,
  MINE_RATE: 1000 * 60 * 10,
  ROOT_URL: "10.8.0.2",
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
