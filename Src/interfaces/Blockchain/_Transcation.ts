import { Wallet_types } from "../../types/Wallet_types";

export interface _Transcation {
    id : string,
    inputMap : {},
    outputMap : {},
    inputMapCreator : (senderWallet : Wallet_types)
}