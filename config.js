const MINE_RATE = 1000;
const DIFFICULTY = 1;
const GENESIS_DATA = {
  hash: 'DEXhash',
  lastHash: 'dexLastHash',
  nonce: 0,
  difficulty: DIFFICULTY,
  timeStamp: '0',
  data: ['DEX-BlockChain'],
};

module.exports = {
  GENESIS_DATA,
  MINE_RATE,
};
