import { hashCreator } from "../../Addon/hash-creator";
import { _Blockchain } from "../../interfaces/Blockchain/_Blockchain";
import { _Errors } from "../../types/errors_interface";
import { _Block } from "../../interfaces/Blockchain/_Block";
import { Block } from "./Block";
export class Blockchain implements _Blockchain {
  chain = [Block.genesis()];
  addBlock(data: Array<any>) {
    const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
    this.chain.push(block);
  }
  static isValid(chain: Array<_Block>): boolean {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;
    for (let i = 1; i < chain.length; i++) {
      if (
        chain[i].hash !==
        hashCreator(
          chain[i].lastHash,
          JSON.stringify(chain[i].data),
          chain[i].nonce.toString(),
          chain[i].difficulty.toString(),
          chain[i].timestamp.toString()
        )
      ) {
        return false;
      }

      if (chain[i].lastHash !== chain[i - 1].hash) {
        return false;
      }
      if (Math.abs(chain[i - 1].difficulty - chain[i].difficulty) > 1) {
        return false;
      }
    }
    return true;
  }
  replaceChain(chain: Array<_Block>): _Errors | boolean {
    if (chain.length < this.chain.length) {
      return { message: "chain is short", code: 101 };
    }
    if (!Blockchain.isValid(chain)) {
      return { message: "chain is not valid", code: 102 };
    }
    this.chain = chain;
    return true;
  }
}
