import { _Transaction } from "../../interfaces/Blockchain/_Transaction";
import { _TransactionPool } from "../../interfaces/Blockchain/_TransactionPool";
export class TransactionPool implements _TransactionPool {
    transactionMap : any = {}; 
    constructor(){
    }
    add(transaction : _Transaction){
        this.transactionMap[transaction.id] = transaction;
    }
};