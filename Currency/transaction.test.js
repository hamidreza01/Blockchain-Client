const Transaction = require("./../Currency/transaction");
const Wallet = require("../Currency/wallet");
const { verifySign } = require("../Addon/pub-pri");
describe("transaction", () => {
  let transaction, senderWallet, recipient, amount;
  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = "sender-public-key";
    amount = 30;
    transaction = new Transaction({ senderWallet, amount, recipient });
  });
  it("has an `id` ", () => {
    expect(transaction).toHaveProperty("id");
  });
  describe("outputMap", () => {
    it("has on `outputMap`", () => {
      expect(transaction).toHaveProperty("outputMap");
    });
    it("check amount of recipient", () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });
    it("check amount of senderWallet", () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        senderWallet.balance - amount
      );
    });
  });
  describe("input", () => {
    it("has an `input`", () => {
      expect(transaction).toHaveProperty("input");
    });
    it("has an timeStamp", () => {
      expect(transaction.input).toHaveProperty("timestamp");
    });
    it("sets the `amount` to the `senderWallet` balance", () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance);
    });
    it("sets the `address` to the `senderWallet` publicKey", () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey);
    });
    it("sign the input", () => {
      expect(
        verifySign({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap,
          sign: transaction.input.signature,
        })
      ).toBe(true);
    });
  });
  describe("Transaction.isValid()", () => {
    console.error = jest.fn();
    it("have isValid method", () => {
      expect(Transaction.isValid).not.toBe(undefined);
    });
    describe("is valid", () => {
      it("return true", () => {
        expect(Transaction.isValid(transaction)).toBe(true);
      });
    });
    describe("is not valid", () => {
      it("invalid outputMap value", () => {
        transaction.outputMap[senderWallet.publicKey] = 1400;
        expect(Transaction.isValid(transaction)).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });
      it("invalid input signature", () => {
        transaction.input.signature = "invalidSign";
        expect(Transaction.isValid(transaction)).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
});
