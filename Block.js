const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./hash-function');
class Block {
  constructor({ timeStamp, lastHash, hash, data }) {
    this.timeStamp = timeStamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }
  static genesis() {
    return new this(GENESIS_DATA);
  }
  static mainBlock({ lastBlock, data }) {
    const timeStamp = Date.now();
    const lastHash = lastBlock.hash;
    return new Block({
      timeStamp,
      lastHash,
      data: data,
      hash: cryptoHash(timeStamp, lastHash, data),
    });
  }
}
module.exports = Block;
