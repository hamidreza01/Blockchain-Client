const express = require("express");
const app = express();
const { webServerConfig, appConfig } = require("../config");
const BlockChain = require("../Blockchain/BlockChain");
const blockChain = new BlockChain();
let nodeList = [];

const axios = require("axios").default;

webServerConfig.port = Math.floor(Math.random() * (20000 + 40000 - 1) + 1);

let serverData = {'port' : appConfig.rootSocketPORT,"host" : appConfig.rootSocketIP,localPort : webServerConfig.port + 2};
const net = require("net").createConnection(serverData);
net.on("connect",()=>{
  setTimeout(()=>{
    net.write(JSON.stringify({action : 'addMe'}));
  },5000)
})
net.on("data",(data)=>{

  data = JSON.parse(data.toString());
  if(data.action == 'newNode'){
    nodeList.push(data.data)
    console.log(nodeList)
  }else if(data.action == 'welcome'){
    nodeList = data.data;
    console.log(nodeList)
    console.log(blockChain.chain)
  }else if(data.action == 'replaceNode'){
    nodeList = data.data;
  }else if(data.action == 'replaceChain'){
    blockChain.chain = data.data;
    console.log(blockChain.chain)
  }else if(data.action == 'sliceChain'){
    blockChain.chain = blockChain.chain.filter((x,i)=>{
      if(i <= data.data){
        return true;
      }else{
        return false;
      }
    })
    console.log(blockChain.chain)
  }else if(data.action == 'giveMeData'){
    net.write(JSON.stringify({action : "dataForYou",nodes : nodeList,chain : blockChain.chain}))
  }
});

net.on("error",()=>{
  console.log('please wait main server is have problem ..');
});

net.on("end",()=>{
  console.log('root server has been error please wait ..');
  let number = 1000;
  let timer = setInterval(()=>{
    net.connect(serverData).on("connect",()=>{
      console.log("ok , i connect to root server");
      clearInterval(timer)
    }).on("error",()=>{
      console.log("connecting to root server ...")
      number = number * 3;
    })
  },number)
});

async function brodcast(chain) {
  return new Promise(async (res) => {
    for (let i = 0; i < nodeList.length; i++) {
      console.log(nodeList[[i]]);
      try {
        await axios.post(`http://${nodeList[i]}/api/replace`, {
          chain,
        });
        console.log("send to node " + i);
      } catch (error) {
        console.log(" error to send node " + i);
      }
    }
    res();
  });
} 

app.use(express.json());
app.use((req, res, next) => {
  if (
    nodeList.find(
      (x) => req.ip.replace("::ffff:", "") === x.split(":")[0]
    )
  ) {
    next();
  } else {
    res.send("who are you ?");
  }
});
app.post("/api/blocks", (req, res, next) => {
  try {
    res.status(200).json(blockChain.chain);
  } catch (err) {
    next(err);
  }
});

// add block on chain
app.post("/api/addBlock", async (req, res, next) => {
  try {
    blockChain.addBlock({ data: req.body.data });
    await brodcast(blockChain.chain);
    res.status(200).json(blockChain.chain);
  } catch (err) {
    next(err);
  }
});

 // replace chain route
app.post("/api/replace", (req, res, next) => {
  try {
    blockChain.replaceChain(req.body.chain);
    res.status(200).json({
      process: true,
    });
  } catch (err) {
    next(err);
  }
});


// shownode list
app.post("/api/Nodes", async (req, res, next) => {
  try {
    res.status(200).json(nodeList);
  } catch (err) {
    next(err);
  }
});

// catch 404 and forward to error handler
app.all("*", (req, res, next) => {
  try {
    const err = new Error(`404 Error , cannot ${req.method} to ${req.url}`);
    err.code = 404;
    err.stack = req.url;
    throw err;
  } catch (err) {
    next(err);
  }
});
// catch errors
app.use(require("./Error/api-Error"));

// start the web server on port
app.listen(webServerConfig.port, () => {
  console.log(`Node Network run in ${webServerConfig.port}`);
});

module.exports = app;
