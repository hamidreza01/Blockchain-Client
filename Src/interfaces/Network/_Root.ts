import { _Errors } from "../../types/errors_interface";
import { _Block } from "../Blockchain/_Block";

export interface _Root {
  start(): void;
  bet(channel: string, callback: Function): void;
  send(channel: string, data: any): void;
}
