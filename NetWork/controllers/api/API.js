const BlockChain = require("../../../BlockChain");
const { appConfig, webServerConfig } = require("../../config");
const blockChain = new BlockChain();
const axios = require('axios').default;

class Connection{
    constructor(){
        (async ()=>{
            const data = await axios.post(`${appConfig.root}/addMe`,{
                port : webServerConfig.port
            })
            blockChain.chain = data.data.chain;
            this.nodeList = data.data.nodeList;
        })()
    }
    async brodcast(chain){
        return new Promise(async (res)=>{
            for(let i = 0 ; i < this.nodeList.length;i++){
                console.log(this.nodeList[[i]])
                try {
                    await axios.post(`http://${this.nodeList[i]}/api/replace`,{
                    chain
                })
                    console.log("send to node " + i)
                
                } catch (error) {
                    console.log(' error to send node '+ i)
                }
                
            }  
            res();
        })
        
    }
}
const connection = new Connection();
module.exports = {
    Blocks : (req,res,next)=>{
        try {
            res.status(200).json(blockChain.chain)
        } catch (err) {
            next(err)
        }
    },
    addBlock : async (req,res,next)=>{
        try{
            blockChain.addBlock({data : req.body.data});
            await connection.brodcast(blockChain.chain);
            res.status(200).json(blockChain.chain);
        }catch(err){
            next(err)
        }
    },
    updateNode : async (req,res,next)=>{
        try{

            if(req.ip.replace('::ffff:','') === connection.nodeList[0].split(":")[0]){
                connection.nodeList.push(req.body.url);
                console.log('from Update one : ',connection.nodeList)
                res.status(200).json({
                    process : true
                })
            }else{
                res.send("Who are you ?")
            }
        }catch(err){
            next(err)
        }
    },
    replace : (req,res,next)=>{
        try {
            blockChain.replaceChain(req.body.chain);
            res.status(200).json({
                process : true
            })
        } catch (err) {
            next(err);
        }
    }
}

// (req,res,next)=>{
//     try{

//     }catch(err){
//         next(err)
//     }
// }