import express from "express";
import { _Block } from "../../interfaces/Blockchain/_Block";
import { _Blockchain } from "../../interfaces/Blockchain/_Blockchain";
import axios from "axios";
import { _Nodes } from "../../interfaces/Network/_Nodes";
export class Nodes implements _Nodes {
  list: Array<string> = [""];
  private app = express();
  private classData = [];
  private blockChain: any;
  constructor(private port: number) {}
  start(blockChain: _Blockchain): void {
    this.blockChain = blockChain;
    this.app.use(express.json());
    this.app.post("/replaceChain", (req, res) => {
      let replaceResualt = this.blockChain.replaceChain(req.body.chain);
      console.log(this.blockChain.chain);

      if (replaceResualt.message) {
        res.send(replaceResualt);
      } else {
        res.send("ok, replace chain my chain is : " + this.blockChain.chain);
      }
    });
    this.app.post("/addBlock", (req, res) => {
      this.blockChain.addBlock(req.body.data);
      this.broadcast("replaceChain", this.blockChain.chain);
      res.send(this.blockChain.chian);
    });
    this.app.listen(this.port, () => {
      console.log("Api run in", this.port);
    });
  }
  async broadcast(name: string, data: any): Promise<void> {
    for (let i = 0; i < this.list.length; i++) {
      await axios.post(`http://${this.list[i]}/${name}`, data);
    }
  }
  bet(name: string, callback: Function): void {
    this.app.post("/" + name, (req, res) => {
      callback(req.body);
      res.send("ok");
    });
  }
}
