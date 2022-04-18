import { _Transaction } from "./_Transaction";
import { _Errors } from "../../types/errors_interface";
import { _Block } from "./_Block";
export interface _Wallet {
    balance : number,
    keyPair : any,
    publicKey : string,
    privateKey : string,
    sign : (data : any) => string;
    createTransaction : ( recipient : string, amount : number, chain : Array<_Block>) => (_Errors | _Transaction)
} 