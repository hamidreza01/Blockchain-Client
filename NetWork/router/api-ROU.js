const express = require("express");
const Router = express.Router();
const CTRL = require("../controllers/api/API")

// Blocks

Router.post("/blocks",CTRL.Blocks);
Router.post("/addBlock",CTRL.addBlock);
Router.post("/replace",CTRL.replace);
Router.post("/addNode",CTRL.updateNode);

// 404 Error 

Router.all("*",(req,res,next)=>{
    try{
        const err = new Error(`404 Error , cannot ${req.method} to ${req.url}`)
        err.code = 404;
        err.stack = req.url;
        throw err;
    }catch(err){ 
        next(err);
    }
})

// Error Handler 

Router.use(require('../Error/api-Error'))

module.exports = Router;