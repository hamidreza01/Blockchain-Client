const webServer = {
    port : process.env.PORT || 23219
}
const app = {
    debug : true,
    root : `http://localhost:45451`
}
module.exports = {
    webServerConfig : webServer,
    appConfig : app
};