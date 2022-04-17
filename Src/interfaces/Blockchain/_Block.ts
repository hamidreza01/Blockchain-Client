import { _Transaction } from "./_Transaction";

export interface _Block {
  timestamp: number;
  data: {transaction ?: [_Transaction]};
  hash: string;
  lastHash: string;
  nonce: number;
  difficulty: number;
}
