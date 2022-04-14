import { _Block } from "../Src/interfaces/Blockchain/_Block";
import { _Blockchain } from "../Src/interfaces/Blockchain/_Blockchain";
import { _Nodes } from "../Src/interfaces/Network/_Nodes";
import { _TransactionPool } from "../Src/interfaces/Blockchain/_TransactionPool";
import { _Transaction } from "../Src/interfaces/Blockchain/_Transaction";
import { Transaction } from "../Src/classes/Blockchain/Transaction";
export default function (
  nodes: _Nodes,
  blockchain: _Blockchain,
  transactionPool: _TransactionPool
) {

  nodes.bet("chain", (data: Array<_Block>) => {
    blockchain.replaceChain(data);
  });

  nodes.bet("transaction", (data: _Transaction) => {
    const check = Transaction.isValid(data);
    if (check !== true) {
      return;
    }
    transactionPool.add(data);
  });
  

}
