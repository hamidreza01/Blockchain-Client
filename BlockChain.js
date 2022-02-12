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
  r;
}
module.exports = BlockChain;
