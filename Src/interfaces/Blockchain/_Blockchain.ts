import { Block_types } from "../../types/Block_types";

export interface _Blockchain {
  readonly chain: Block_types[];
  addBlock: (data: Array<any>) => void;
  replaceChain: (chain : Array<Block_types>) => string | boolean
}
