export type Wallet_types = {
    balance : number,
    keyPair : any,
    publicKey : string,
    sign : (data : Array<any>) => string   
} 