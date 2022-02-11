const crypto = require('crypto');
const cryptoHash = (...inputs) => {
  const hash = crypto.createHash('sha256');
  const dataHash = hash.update(inputs.sort().join(' '));
  return dataHash.digest('hex');
};
module.exports = cryptoHash;
