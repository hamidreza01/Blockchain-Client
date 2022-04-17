import { _Transaction } from "./_Transaction";
import {_Wallet} from "./_Wallet";
import { _Block } from "./_Block";
export interface _TransactionPool {
    transactionMap : any,
    add : (transaction : _Transaction) => void ;
    isHave : (wallet : _Wallet) => _Transaction | undefined;
    clear : () => void;
    clearBlockchainTransactions : (chain : Array<_Block>) => void;
}