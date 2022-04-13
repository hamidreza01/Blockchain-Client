import { _Block } from "../Src/interfaces/Blockchain/_Block";
import { _Blockchain } from "../Src/interfaces/Blockchain/_Blockchain";
import { _Nodes } from "../Src/interfaces/Network/_Nodes";

export default function (nodes : _Nodes,blockchain : _Blockchain){
    nodes.bet("replaceChain", (data : Array<_Block>) => {
        blockchain.replaceChain(data);
    })
}   