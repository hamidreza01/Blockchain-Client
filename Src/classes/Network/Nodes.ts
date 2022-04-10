import express from "express";
import { _Block } from "../../interfaces/Blockchain/_Block";
import { _Blockchain } from "../../interfaces/Blockchain/_Blockchain";
import axios from "axios";
export class Nodes {
  list: Array<string> = [""];
  private app = express();
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
      this.broadcast(this.blockChain.chain)
      res.send(this.blockChain.chian);
    });
    this.app.listen(this.port, () => {
      console.log("Api run in", this.port);
    });
  }
  async broadcast(chain: Array<_Block>): Promise<void> {
    for (let i = 0; i < this.list.length; i++) {
      await axios.post(`http://${this.list[i]}/replaceChain`,{chain})
    }
  }
}
