const { appConfig } = require("../config");

module.exports = (err,req,res,next)=>{
    const code = err.code || 500;
    const location = err.stack || req.url;
    if(appConfig.debug){
        res.status(500).json({
            msg : err.message,
            statusCode : code,
            location : location
        })
    }else{
        res.status(500).json({
            msg : err.message,
            statusCode : code,
            location : req.url
        })
    }

}