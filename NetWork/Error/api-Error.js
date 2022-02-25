const { appConfig } = require("../config");

// api error middleware
module.exports = (err,req,res,next)=>{
    const code = err.code || 500;
    const location = err.stack || req.url;
    // handle debug mode
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