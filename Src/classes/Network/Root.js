"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Root = void 0;
const config_1 = require("../../../config");
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
class Root {
    constructor(port) {
        this.port = port;
        this.app = (0, express_1.default)();
    }
    start() {
        this.app.use(express_1.default.json());
        this.app.listen(this.port);
    }
    bet(channel, callback) {
        this.app.use(express_1.default.json());
        this.app.post("/" + channel, (req, res) => {
            callback(req.body);
            res.send("ok");
        });
    }
    send(channel, data) {
        try {
            axios_1.default.post(`http://${config_1.config.ROOT_URL}`, data);
        }
        catch (err) {
            console.log(`error send data to root server with ${channel} channel`);
        }
    }
}
exports.Root = Root;
