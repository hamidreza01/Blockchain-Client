import { _Transaction } from "./_Transaction";
import { _Errors } from "../../types/errors_interface";
export interface _Wallet {
    balance : number,
    keyPair : any,
    publicKey : string,
    sign : (data : any) => string;
    createTransaction : ( recipient : string, amount : number ) => (_Errors | _Transaction)
} 