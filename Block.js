const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptoHash = require('./hash-function');
const hex2bin = require('hex-to-binary');
class Block { 
  // return object 
  constructor({ timeStamp, lastHash, hash, data, nonce, difficulty }) {
    this.timeStamp = timeStamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }
  // return genesis block 
  static genesis() {
    return new this(GENESIS_DATA);
  }
  // mine Block
  static mainBlock({ lastBlock, data }) {
    let timeStamp, hash;
    let nonce = 0;
    let difficulty = lastBlock.difficulty;
    const lastHash = lastBlock.hash;
    do {
      nonce++;
      timeStamp = Date.now();
      difficulty = Block.adJustDifficulty({ lastBlock, timeStamp });
      hash = cryptoHash(timeStamp, nonce, difficulty, lastHash, data);
    } while (hex2bin(hash).slice(0, difficulty) !== '0'.repeat(difficulty));
    {
      return new Block({
        difficulty,
        timeStamp,
        lastHash,
        data: data,
        hash,
        nonce,
      });
    }
  }
  // difficulty changer 
  static adJustDifficulty({ lastBlock, timeStamp }) {
    const { difficulty } = lastBlock;
    if (difficulty < 1) return 1;
    if (timeStamp - lastBlock.timeStamp > MINE_RATE) return difficulty - 1;
    return difficulty + 1;
  }
}
module.exports = Block;
