import { _Block } from "../Blockchain/_Block";
import { _Blockchain } from "../Blockchain/_Blockchain";

export interface _Nodes {
    list : Array<string>,
    start : (blockChain : _Blockchain) => void,
    broadcast : (chain : Array<_Block>) => Promise<void>,
}