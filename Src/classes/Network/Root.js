"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Root = void 0;
const config_1 = require("../../../config");
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const uniqid_1 = __importDefault(require("uniqid"));
class Root {
    constructor(port) {
        this.port = port;
        this.app = (0, express_1.default)();
        this.hash = (0, uniqid_1.default)();
    }
    start() {
        this.app.use(express_1.default.json());
        this.app.use((req, res, next) => {
            console.log("\nip: %s\npath: %s\nmethod: %s\nbody: %s\n", req.ip, req.path, req.method, JSON.parse(Buffer.from(req.body.data, "base64").toString("ascii")));
            req.body.data = JSON.parse(Buffer.from(req.body.data, "base64").toString("ascii"));
            next();
        });
        this.app.use((req, res, next) => {
            if (req.body.data.hash !== this.hash) {
                console.log("403");
                return res.send("403");
            }
            next();
        });
        this.app.listen(this.port);
    }
    bet(channel, callback) {
        this.app.post("/" + channel, (req, res) => {
            callback(req.body.data);
            res.send("ok");
        });
    }
    send(channel, data) {
        try {
            data.hash = this.hash;
            axios_1.default.post(`http://${config_1.config.ROOT_URL}/${channel}`, data);
        }
        catch (err) {
            console.log(`error send data to root server with ${channel} channel`);
        }
    }
}
exports.Root = Root;
