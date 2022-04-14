import { _Transaction } from "../../interfaces/Blockchain/_Transaction";
import { _TransactionPool } from "../../interfaces/Blockchain/_TransactionPool";
import { _Wallet } from "../../interfaces/Blockchain/_Wallet";
import { _Errors } from "../../types/errors_interface";
import { Transaction } from "./Transaction";
export class TransactionPool implements _TransactionPool {
    transactionMap : any = {}; 
    constructor(){
    }
    
    add(transaction : _Transaction) : void | _Errors {
        // const check = Transaction.isValid(transaction)
        // if(check !== true){
        //     return check as _Errors;
        // } 
        this.transactionMap[transaction.id] = transaction;
    }
    isHave(wallet : _Wallet) : _Transaction | undefined { 
        let val =  Object.values(this.transactionMap) as Array<_Transaction>
        return val.find(x=>{
            return x.inputMap.address === wallet.publicKey
        });
    }
};