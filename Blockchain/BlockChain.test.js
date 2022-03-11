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
    const blockChain = new BlockChain();
    const testBlock = Block.mainBlock({
      data: 'test',
      lastBlock: Block.genesis(),
    });
    blockChain.addBlock({ data: 'test' });
    it('add block test', () => {
      expect(blockChain.chain[1].data === testBlock.data).toBe(true);
      expect(blockChain.chain[1].lastHash === testBlock.lastHash).toBe(true);
    });
  });
  describe('isValid()', () => {
    let blockChain;
    beforeEach(() => {
      blockChain = new BlockChain();
      blockChain.addBlock({ data: 'test 1' });
      blockChain.addBlock({ data: 'test 2' });
      blockChain.addBlock({ data: 'test 3' });
    });
    it('returns true', () => {
      expect(BlockChain.isValid(blockChain.chain)).toEqual(true);
    });
    describe('returns flase', () => {
      it('lastHash problem', () => {
        blockChain.chain[2].lastHash = 'fake last hash';
        expect(BlockChain.isValid(blockChain.chain)).toEqual(false);
      });
      it('genesis problem', () => {
        blockChain.chain[0] = 'fake Genesis block';
        expect(BlockChain.isValid(blockChain.chain)).toEqual(false);
      });

      it('fake hash problem', () => {
        blockChain.chain[2].hash = 'fake hash';
        expect(BlockChain.isValid(blockChain.chain)).toEqual(false);
      });
    });
  });
  describe('replaceChain()', () => {
    let blockChain;
    let newBlock;
    let oldBlock;
    beforeEach(() => {
      blockChain = new BlockChain();
      newBlock = new BlockChain();
      oldBlock = blockChain.chain;
      global.console.log = () => {};
      global.console.error = () => {};
    });
    it('is shorter', () => {
      blockChain.replaceChain(newBlock.chain);
      expect(blockChain.chain).toEqual(oldBlock);
    });
    describe('is longer', () => {
      it('valid chian', () => {
        newBlock.addBlock({ data: 'long chain' });
        blockChain.replaceChain(newBlock.chain);
        expect(blockChain.chain).toEqual(newBlock.chain);
      });
      it('hash problem', () => {
        newBlock.addBlock({ data: 'long chain' });
        newBlock.chain[1].hash = 'fakeHash';
        blockChain.replaceChain(newBlock.chain);
        expect(blockChain.chain).toEqual(oldBlock);
      });
      it('lastHash problem', () => {
        newBlock.addBlock({ data: 'long chain' });
        newBlock.chain[1].lastHash = 'fake Last Hash';
        blockChain.replaceChain(newBlock.chain);
        expect(blockChain.chain).toEqual(oldBlock);
      });
    });
  });
});
