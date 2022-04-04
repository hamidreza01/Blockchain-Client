import express from 'express';
import { _Block } from '../../interfaces/Blockchain/_Block';
import { _Blockchain } from '../../interfaces/Blockchain/_Blockchain';
import axios from 'axios'
export class Nodes {
    list : Array<string> = [''];
    private app = express();
    private blockChain : any; 
    start(blockChain : _Blockchain) : void {
        this.blockChain = blockChain;
        this.app.use(express.json())
        this.app.post("/replaceChain",(req,res)=>{
            let replaceResualt = this.blockChain.replaceChain(req.body.chain);
            if(!replaceResualt.code){
                return res.send("ok, replace chain my chain is : " + this.blockChain.chain)
            }
            return res.send(replaceResualt)
        })
    }
    async *broadcast(chain : Array<_Block>) : any {
        for(let i = 0 ; i < this.list.length ; i++){
           yield await axios.post(this.list[i]);
        }
    }
}