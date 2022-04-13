import { _Transaction } from "./_Transaction";
import {_Wallet} from "./_Wallet";
export interface _TransactionPool {
    transactionMap : any,
    add : (transaction : _Transaction) => void ;
    isHave : (wallet : _Wallet) => _Transaction | undefined  
}