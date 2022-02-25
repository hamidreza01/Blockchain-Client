// config for the app
const MINE_RATE = 10000;
const DIFFICULTY = 10;
const GENESIS_DATA = {
  hash: 'DEXhash',
  lastHash: 'dexLastHash',
  nonce: 0,
  difficulty: DIFFICULTY,
  timeStamp: '0',
  data: ['DEX-BlockChain'],
};
const webServer = {
  port : process.env.PORT || 23219
}
const app = {
  debug : true,
  root : `http://localhost:45451`
}
module.exports = {
  webServerConfig : webServer,
  appConfig : app,
  GENESIS_DATA,
  MINE_RATE,
};
