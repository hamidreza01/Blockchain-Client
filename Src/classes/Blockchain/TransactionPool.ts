import { _Transaction } from "../../interfaces/Blockchain/_Transaction";
import { _TransactionPool } from "../../interfaces/Blockchain/_TransactionPool";
import { _Wallet } from "../../interfaces/Blockchain/_Wallet";
export class TransactionPool implements _TransactionPool {
    transactionMap : any = {}; 
    constructor(){
    }
    
    add(transaction : _Transaction){
        this.transactionMap[transaction.id] = transaction;
    }
    isHave(wallet : _Wallet){
        let val =  this.transactionMap.values() as Array<_Transaction>
        return val.find(x=>x.inputMap.address === wallet.publicKey)
    }
};