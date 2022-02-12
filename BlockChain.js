const Block = require('./Block');
const cryptoHash = require('./hash-function');

class BlockChain {
  constructor() {
    this.chain = [Block.genesis()];
  }
  addBlock({ data }) {
    const block = Block.mainBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data: data,
    });
    this.chain.push(block);
  }
  static isValid(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;
    for (let i = 1; i < chain.length; i++) {
      if (chain[i].lastHash !== chain[i - 1].hash) {
        return false;
      }
      if (
        chain[i].hash !==
        cryptoHash(chain[i].timeStamp, chain[i].lastHash, chain[i].data)
      ) {
        return false;
      }
    }
    return true;
  }
  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error('chain is short');
      return;
    }
    if (!BlockChain.isValid(chain)) {
      console.error('chain is not valid');
      return;
    }
    this.chain = chain;
    console.log('replace chain with : ', chain);
  }
}
module.exports = BlockChain;
