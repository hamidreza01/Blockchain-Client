const express = require("express");
const app = express();
const { webServerConfig , appConfig} = require("../config");
const BlockChain = require("./../BlockChain/BlockChain");
const blockChain = new BlockChain();
const axios = require('axios').default;
app.use(express.json());

// random port for web server
webServerConfig.port =  Math.floor(Math.random() * (20000 + 40000 - 1) + 1);

// class representing a connection to the node list
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

// conection end

const connection = new Connection();


app.post("/api/blocks",(req,res,next)=>{
    try {
        res.status(200).json(blockChain.chain)
    } catch (err) {
        next(err)
    }
});

// add block on chain
app.post("/api/addBlock",async (req,res,next)=>{
    try{
        blockChain.addBlock({data : req.body.data});
        await connection.brodcast(blockChain.chain);
        res.status(200).json(blockChain.chain);
    }catch(err){
        next(err)
    }
});

// replace chain route
app.post("/api/replace",(req,res,next)=>{
    try {
        blockChain.replaceChain(req.body.chain);
        res.status(200).json({
            process : true
        })
    } catch (err) {
        next(err);
    }
});

// add node to nodeList
app.post("/api/addNode",async (req,res,next)=>{
    try{
        let ip = req.ip.replace('::ffff:','')
        if(ip === connection.nodeList[0].split(":")[0]){
            connection.nodeList.push(req.body.url);
            console.log(`recived update from ${ip} nodeList : `, connection.nodeList)
            res.status(200).json({
                process : true
            })
        }else{
            res.send("Who are you ?")
        }
    }catch(err){
        next(err)
    }
});

// shownode list
app.post("/api/Nodes",async (req,res,next)=>{
    try {
        res.status(200).json(connection.nodeList);
    } catch (err) {
        next(err)
    }
},)

// catch 404 and forward to error handler
app.all("*",(req,res,next)=>{
    try{
        const err = new Error(`404 Error , cannot ${req.method} to ${req.url}`)
        err.code = 404;
        err.stack = req.url;
        throw err;
    }catch(err){ 
        next(err);
    }
})

// catch errors
app.use(require('./Error/api-Error'))

// start the web server on port
app.listen(webServerConfig.port,()=>{
    console.log(`BlockChain run in ${webServerConfig.port}`)
})


module.exports = app;