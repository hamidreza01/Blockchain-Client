const Block = require('./Block');

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
}
module.exports = BlockChain;
