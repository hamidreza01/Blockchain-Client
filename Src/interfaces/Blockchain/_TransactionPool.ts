import { _Transaction } from "./_Transaction";

export interface _TransactionPool {
    transactionMap : any,
    add : (transaction : _Transaction) => void 
}