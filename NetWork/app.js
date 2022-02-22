const express = require("express");
const app = express();
const { webServerConfig } = require("./config");
const MDLW = require("./middleware/api-MID");

// middleware 

MDLW(app,express)

// api 
webServerConfig.port =  Math.floor(Math.random() * (20000 + 40000 - 1) + 1);

app.use("/api",require("./router/api-ROU"))

// listen 

app.listen(webServerConfig.port,()=>{
    console.log(`BlockChain run in ${webServerConfig.port}`)
})


module.exports = app;