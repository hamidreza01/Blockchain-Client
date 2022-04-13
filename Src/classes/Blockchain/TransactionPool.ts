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
    isHave(wallet : _Wallet) : _Transaction | undefined { 
        let val =  Object.values(this.transactionMap) as Array<_Transaction>
        console.log(wallet.publicKey)
        console.log(val.find(x=>{
            console.log(x.inputMap.address, wallet.publicKey);
            return x.inputMap.address === wallet.publicKey
        }))
        return val.find(x=>{
            return x.inputMap.address === wallet.publicKey
        });
    }
};