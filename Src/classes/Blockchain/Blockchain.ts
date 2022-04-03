import { hashCreator } from "../../Addon/hash-creator";
import { _Blockchain } from "../../interfaces/Blockchain/_Blockchain";
import { Block_types } from "../../types/Block_types";
import { Block } from "./Block";
export class Blockchain implements _Blockchain {
  chain = [Block.genesis()];
  addBlock(data: Array<any>) {
    const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
    this.chain.push(block);
  }
  static isValid(chain: Block_types[]): boolean {
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
  replaceChain(chain: Array<any>): string | boolean {
    if (chain.length < this.chain.length) {
      return "chain is short";
    }
    if (!Blockchain.isValid(chain)) {
      return "chain is not valid";
    }
    this.chain = chain;
    return "replaced chain with : " + chain;
  }
}
