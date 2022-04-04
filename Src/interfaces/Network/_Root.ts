import { _Errors } from "../../types/errors_interface";
import { _Block } from "../Blockchain/_Block";

export interface _Root {
  start: () => Promise<_Errors | boolean>;
  addMe: () => void | _Errors;
  giveData : (chain : Array<_Block>,nodeList : Array<string>) => void | _Errors;
  bet: (betName : string , callBack : Function) => void;
}
