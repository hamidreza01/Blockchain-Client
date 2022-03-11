const cryptoHash = require("./hash-function");

const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const verifySign = ({ data, sign, publicKey }) => {
  const vrf = ec.keyFromPublic(publicKey, "hex");
  try {
    return vrf.verify(cryptoHash(data), sign);
  } catch (error) {
    return false;
  }
};
module.exports = { ec, verifySign };
