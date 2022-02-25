const Block = require('./Block');
const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./hash-function');

describe(' `Block` class', () => {
  let timeStamp = 'time-test';
  let hash = 'hash-test';
  let lastHash = 'last-test';
  let data = ['data'];
  const block = new Block({ timeStamp, lastHash, hash, data });
  it('test for `Block` return properties', () => {
    expect(block.data).toEqual(data);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.timeStamp).toEqual(timeStamp);
  });
  describe('test `genesis` ', () => {
    const firstBlock = Block.genesis();
    it('instanceof gen', () => {
      expect(firstBlock instanceof Block).toEqual(true);
    });
    it('test `genesis` data', () => {
      expect(firstBlock).toEqual(GENESIS_DATA);
    });
  });
  describe('test The `mainBlock` ', () => {
    const lastBlock = Block.genesis();
    const data = ['test data'];
    const mainBlock = Block.mainBlock({ lastBlock, data });
    it('instanceof mainBlock', () => {
      expect(mainBlock instanceof Block).toEqual(true);
    });
    it('test `hash` and `LastHash` ', () => {
      expect(mainBlock.lastHash).toEqual(lastBlock.hash);
    });
    it('test `data` ', () => {
      expect(mainBlock.data).toEqual(data);
    });
    it('test `timeStamp` ', () => {
      expect(mainBlock.timeStamp).not.toEqual(undefined);
    });
  });
});
