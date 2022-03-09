const Wallet = require("./wallet");
const {verifySign} = require("../Addon/pub-pri")
describe("wallet", () => {
  let wallet;
  beforeEach(() => {
    wallet = new Wallet();
  });
  describe("property", () => {
    it("is have `publicKey` ", () => {
        expect(wallet).toHaveProperty("publicKey");
    });
    it('is have balance',()=>{
        expect(wallet).toHaveProperty("balance");
    });
  });
  describe("sign data",()=>{
      const data = 'test-data';
      it("is valid sign",()=>{
          expect(verifySign({
              data,
              publicKey : wallet.publicKey ,
              sign : wallet.sign(data),
          })).toBe(true)
      })
      it("is not valid sign",()=>{
        expect(verifySign({
            data,
            publicKey : new Wallet().publicKey ,
            sign : wallet.sign(data),
        })).toBe(false)
    })
  })
});


