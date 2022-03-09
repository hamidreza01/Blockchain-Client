const cryptoHash = require('./hash-function');

const EC = require('elliptic').ec;
const ec =  new EC('secp256k1');

const verifySign = ({data , sign , publicKey})=>{
    const vrf = ec.keyFromPublic(publicKey,'hex');
    return vrf.verify(cryptoHash(data),sign)
}
module.exports = {ec , verifySign};