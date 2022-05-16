import { _Block } from "../Src/interfaces/Blockchain/_Block";
import { _Blockchain } from "../Src/interfaces/Blockchain/_Blockchain";
import { _Nodes } from "../Src/interfaces/Network/_Nodes";
import { _TransactionPool } from "../Src/interfaces/Blockchain/_TransactionPool";
import { _Transaction } from "../Src/interfaces/Blockchain/_Transaction";
import { Transaction } from "../Src/classes/Blockchain/Transaction";
import { _Wallet } from "../Src/interfaces/Blockchain/_Wallet";
import { Cluster } from "cluster";
export default function (
  nodes: _Nodes,
  blockchain: _Blockchain,
  transactionPool: _TransactionPool,
  admin : _Wallet,
  cluster : Cluster
) {

  nodes.bet("chain", (data: Array<_Block>) => {
    console.log('recived chain : \n',data)
    if(blockchain.validTransactionData(data) === true && blockchain.replaceChain(data) === true) {
      transactionPool.clearBlockchainTransactions(data);
    };
  });

  nodes.bet("transaction", (data: _Transaction) => {
    const check = Transaction.isValid(data);
    if (check !== true) {
      return;
    }
    transactionPool.add(data);
  });
  

}
