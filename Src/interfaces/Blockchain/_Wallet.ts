export interface _Wallet {
    balance : number,
    keyPair : any,
    publicKey : string,
    sign : (data : Array<any>) => string   
} 