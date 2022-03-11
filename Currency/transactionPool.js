class TransactionPool{
    constructor(){
        this.transactionMap = {}; 
    }
    add(transaction){
        this.transactionMap[transaction.id] = transaction;
    }
};

module.exports = TransactionPool;