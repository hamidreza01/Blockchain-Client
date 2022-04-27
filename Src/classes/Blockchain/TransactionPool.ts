import { _Transaction } from "../../interfaces/Blockchain/_Transaction";
import { _TransactionPool } from "../../interfaces/Blockchain/_TransactionPool";
import { _Wallet } from "../../interfaces/Blockchain/_Wallet";
import { _Errors } from "../../types/errors_interface";
import { Transaction } from "./Transaction";
import {_Block} from "../../interfaces/Blockchain/_Block";
export class TransactionPool implements _TransactionPool {
    transactionMap : any = {}; 
    constructor(){
    }
    add(transaction : _Transaction) : void | _Errors {
        this.transactionMap[transaction.id] = transaction;
    }
    isHave(wallet : _Wallet) : _Transaction | undefined { 
        let val =  Object.values(this.transactionMap) as Array<_Transaction>
        return val.find(x=>{
            return x.inputMap.address === wallet.publicKey
        });
    }
    clear(){
        this.transactionMap = {}
    }
    clearBlockchainTransactions(chain : Array<_Block>) : void {
        for(let i = 1 ; i < chain.length ; i++){
            const block = chain[i];
            for(let j = 1 ; j < block.data.transaction!.length ; j++){
                const tx = block.data.transaction![j];
                delete this.transactionMap[tx.id];
            }
        }
    }
};