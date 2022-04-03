import { Wallet } from "./Src/classes/Blockchain/Wallet";
import { Transaction } from "./Src/classes/Blockchain/Transaction";
const wallet = new Wallet();
const transaction = new Transaction(wallet,10,'teiajsdijasd213asdiohasoidhiasdias123st')
console.log(Transaction.isValid(transaction))