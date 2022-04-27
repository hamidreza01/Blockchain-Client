import { _Block } from "../Blockchain/_Block";
import { _Blockchain } from "../Blockchain/_Blockchain";

export interface _Nodes {
    list : Array<string>,
    start : () => void,
    broadcast : (name : string , data : any) => Promise<void>,
    bet : (name : string , callback : Function) => void
}