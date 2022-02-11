const Block = require('./Block');
const BlockChain = require('./BlockChain');

describe('BlockChain', () => {
  const blockChain = new BlockChain();
  it('chain array', () => {
    expect(blockChain.chain instanceof Array).toBe(true);
    expect(blockChain.chain != undefined);
  });
  it('first block', () => {
    expect(
      JSON.stringify(blockChain.chain[0]) == JSON.stringify(Block.genesis())
    ).toEqual(true);
  });
  describe('add Block', () => {
    const testBlock = Block.mainBlock({
      data: 'test',
      lastBlock: Block.genesis(),
    });
    blockChain.addBlock({ data: 'test' });

    it('add block test', () => {
      expect(blockChain.chain[1].data === testBlock.data).toEqual(true);
      expect(blockChain.chain[1].hash === testBlock.hash).toEqual(true);
      expect(blockChain.chain[1].lastHash === testBlock.lastHash).toEqual(true);
    });
  });
});
