import { hashCreator } from "../../Addon/hash-creator";
import { _Blockchain } from "../../interfaces/Blockchain/_Blockchain";
import { _Errors } from "../../types/errors_interface";
import { _Block } from "../../interfaces/Blockchain/_Block";
import { Block } from "./Block";
import { _Transaction } from "../../interfaces/Blockchain/_Transaction";
import { config } from "../../../config";
import { Transaction } from "./Transaction";
import { Wallet } from "./Wallet";
export class Blockchain implements _Blockchain {
  chain = [Block.genesis()];

  addBlock(data: { transaction: [_Transaction] }): void {
    const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
    this.chain.push(block);
  }

  static isValid(chain: Array<_Block>): boolean {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;
    for (let i = 1; i < chain.length; i++) {
      if (
        chain[i].hash !==
        hashCreator(
          chain[i].lastHash,
          JSON.stringify(chain[i].data),
          chain[i].nonce.toString(),
          chain[i].difficulty.toString(),
          chain[i].timestamp.toString()
        )
      ) {
        return false;
      }

      if (chain[i].lastHash !== chain[i - 1].hash) {
        return false;
      }
      if (Math.abs(chain[i - 1].difficulty - chain[i].difficulty) > 1) {
        return false;
      }
    }
    return true;
  }
  replaceChain(chain: Array<_Block>): _Errors | boolean {
    if (chain.length < this.chain.length) {
      return { message: "chain is short", code: 101 };
    }
    if (!Blockchain.isValid(chain)) {
      return { message: "chain is not valid", code: 102 };
    }
    this.chain = chain;
    return true;
  }
  validTransactionData(chain: Array<_Block>): boolean | _Errors {
    for (let i = 1; i < chain?.length; i++) {
      if (chain[i]?.data?.transaction?.length! < 1)
        return { message: "chain data is empty", code: 120 };
      for (let transaction of chain[i]?.data?.transaction!) {
        let rewardNumber = 0;
        if (
          transaction?.inputMap?.address === config.REWARD_TRANSACTION.address
        ) {
          rewardNumber++;
          if (rewardNumber > 1) {
            return {
              message: "reward transaction length is ivalid",
              code: 122,
            };
          }
          if (
            (Object.values(transaction.outputMap).reduce(
              (all, val) => ((all as any) + val) as any
            ) as number) > config.REWARD
          ) {
            return { message: "reward transaction is invalid", code: 121 };
          }
        } else {
          let transactionResualt = Transaction.isValid(transaction);
          if (transactionResualt !== true) {
            return transactionResualt;
          } else {
            const trueValue = Wallet.calculateBalance(
              this.chain,
              transaction.inputMap.address
            );
            if (trueValue !== transaction.inputMap.amount) {
              return { message: "transaction amount is invalid", code: 123 };
            }
          }
        }
      }
    }
    return true;
  }
}
