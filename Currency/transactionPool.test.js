const Transaction = require("./transaction");
const Wallet = require("./wallet");
const TransactionPool = require("./transactionPool");

describe("TransactionPool", () => {
  let transaction, transactionPool;
  beforeEach(() => {
    transaction = new Transaction({
      senderWallet: new Wallet(),
      amount: 50,
      recipient: "test",
    });
    transactionPool = new TransactionPool();
  });

  it("add transaction", () => {
    transactionPool.add(transaction);
    expect(transactionPool.transactionMap[transaction.id]).toEqual(transaction);
  });
});
