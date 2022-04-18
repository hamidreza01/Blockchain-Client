import { _Nodes } from "../../interfaces/Network/_Nodes";
import { _Block } from "../../interfaces/Blockchain/_Block";
import { _Wallet } from "../../interfaces/Blockchain/_Wallet";
import { _Blockchain } from "../../interfaces/Blockchain/_Blockchain";
import { Transaction } from "./Transaction";
import { _TransactionPool } from "../../interfaces/Blockchain/_TransactionPool";
import { _Transaction } from "../../interfaces/Blockchain/_Transaction";
import { _TransactionMiner } from "../../interfaces/Blockchain/_TransactionMiner";
export class TransactionMiner implements _TransactionMiner{
    constructor(private transactionPool : _TransactionPool, private blockchain : _Blockchain, private wallet : _Wallet, private nodes : _Nodes ){
    }
    mineTransaction() : Promise<void> {
        return new Promise((res)=>{
            const transactions =[Transaction.reward(this.wallet),...Object.values(this.transactionPool.transactionMap)];
            this.blockchain.addBlock({transaction : transactions as any});
            this.nodes.broadcast("chain",this.blockchain.chain);
            this.transactionPool.clear();
            res()
        })
    }
}