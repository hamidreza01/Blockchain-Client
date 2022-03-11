const crypto = require('crypto');

/*
create a sha256 hash of the inputs
Args:
 - ...inputs

*/

const cryptoHash = (...inputs) => {
  const hash = crypto.createHash('sha256');
  const dataHash = hash.update(inputs.sort().map(x => {return JSON.stringify(x)}).join(' '));
  return dataHash.digest('hex');
};

module.exports = cryptoHash;
