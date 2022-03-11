const Block = require("./Block");
const cryptoHash = require("../Addon/hash-function");

// class representing a block chain object
class BlockChain {
  // blocks constructor
  constructor() {
    this.chain = [Block.genesis()];
  }

  // add a block to the chain
  addBlock({ data }) {
    const block = Block.mainBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data: data,
    });
    this.chain.push(block);
  }

  // check if chain is a valid

  static isValid(chain) {
    // check if genesis block
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      // check if chain has the same hash
      if (chain[i].lastHash !== chain[i - 1].hash) {

        return false;
      }

      if (Math.abs(chain[i - 1].defficulty - chain[i]) > 1) {
        return false;
      }

      // check the hash of the chain
      if (
        chain[i].hash !==
        cryptoHash(
          chain[i].timeStamp,
          chain[i].nonce,
          chain[i].difficulty,
          chain[i].lastHash,
          chain[i].data
        )
      ) {
        return false;
      }
    }
    return true;
  }

  // replace the chain with a new chain
  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("chain is short");
      return;
    }

    if (!BlockChain.isValid(chain)) {
      console.error("chain is not valid");
      return;
    }
    this.chain = chain;
    console.log("replace chain with : ", chain);
  }
}

module.exports = BlockChain;