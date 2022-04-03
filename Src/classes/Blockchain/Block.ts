import { config } from "../../../config";
import { hashCreator } from "../../Addon/hash-creator";
import { _Block } from "../../interfaces/Blockchain/_Block";

import hexToBin from "hex-to-bin";

export class Block implements _Block {
  constructor(
    public timestamp: number,
    public data: Array<any>,
    public hash: string,
    public lastHash: string,
    public nonce: number,
    public difficulty: number
  ) {}
  static genesis(): _Block {
    return config.GENESIS_DATA;
  }
  static mineBlock(lastBlock: _Block, data: Array<any>): _Block {
    const { hash: lastHash } = lastBlock;
    let difficulty = lastBlock.difficulty;
    let nonce = 0;
    let hash: string, timestamp: number;
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adJustDifficulty(lastBlock, timestamp);
      hash = hashCreator(
        lastHash,
        nonce.toString(),
        timestamp.toString(),
        JSON.stringify(data),
        difficulty.toString()
      );
    } while (hexToBin(hash).slice(0, difficulty) !== "0".repeat(difficulty));
    {
      return new Block(timestamp, data, hash, lastHash, nonce, difficulty);
    }
  }
  static adJustDifficulty(lastBlock: _Block, timestamp: number) {
    if (lastBlock.difficulty < 1) return 1;
    if (timestamp - lastBlock.timestamp > config.MINE_RATE)
      return lastBlock.difficulty - 1;
    return lastBlock.difficulty + 1;
  }
}
