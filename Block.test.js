const Block = require('./Block');
const { GENESIS_DATA } = require('./config');

describe('کلاس بلاک', () => {
  let timeStamp = 'time-test';
  let hash = 'hash-test';
  let lastHash = 'last-test';
  let data = ['data'];
  const block = new Block({ timeStamp, lastHash, hash, data });
  it('بررسی پراپرتی های برگشتی بلاک', () => {
    expect(block.data).toEqual(data);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.timeStamp).toEqual(timeStamp);
  });
  describe('بررسی جنسیس بلاک', () => {
    const firstBlock = Block.genesis();
    it('instanceof gen', () => {
      expect(firstBlock instanceof Block).toEqual(true);
    });
    it('بررسی دیتای جنسیس', () => {
      expect(firstBlock).toEqual(GENESIS_DATA);
    });
  });
  describe('بررسی ماین بلاک', () => {
    const lastBlock = Block.genesis();
    const data = ['test data'];
    const mainBlock = Block.mainBlock({ lastBlock, data });
    it('instanceof mainBlock', () => {
      expect(mainBlock instanceof Block).toEqual(true);
    });
    it('بررسی هش و لست هش', () => {
      expect(mainBlock.lastHash).toEqual(lastBlock.hash);
    });
    it('بررسی دیتا', () => {
      expect(mainBlock.data).toEqual(data);
    });
    it('بررسی تایم', () => {
      expect(mainBlock.timeStamp).not.toEqual(undefined);
    });
  });
});
