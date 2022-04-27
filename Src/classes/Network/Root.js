"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Root = void 0;
const config_1 = require("../../../config");
const net_1 = __importDefault(require("net"));
class Root {
    constructor(port) {
        this.port = port;
        this.classData = [
            {
                betName: "genesis",
                callBack: () => {
                    console.log('oops, im genesis');
                },
            },
        ];
        this.client = net_1.default.createConnection({
            port: config_1.config.ROOT_PORT,
            host: config_1.config.ROOT_URL,
            localPort: port,
        });
    }
    start() {
        this.client.on("data", (data) => {
            console.log(data.toString());
            try {
                data = JSON.parse(data.toString());
            }
            catch (error) {
                console.log(error);
            }
            let better = this.classData.find((x) => {
                return x.betName === data.action;
            });
            if (better) {
                better.callBack(data.data ? data.data : undefined);
            }
        });
        return new Promise((res, rej) => {
            this.client.on("connect", () => {
                res(true);
            });
            this.client.on("timeout", () => {
                rej({ message: "connect to the root server of timeout", code: 251 });
            });
            this.client.on("error", () => {
                rej({ message: "error connecting to the root server", code: 250 });
            });
        });
    }
    addMe() {
        this.client.write(JSON.stringify({ action: "addMe" }));
        this.client.on("timeout", () => {
            return { message: "connect to the root server of timeout", code: 251 };
        });
        this.client.on("error", () => {
            return { message: "error connecting to the root server", code: 250 };
        });
    }
    giveData(chain, nodeList) {
        this.client.write(JSON.stringify({ action: "giveMeData", data: { chain, nodeList } }));
        this.client.on("timeout", () => {
            return { message: "connect to the root server of timeout", code: 251 };
        });
        this.client.on("error", () => {
            return { message: "error connecting to the root server", code: 250 };
        });
    }
    bet(betName, callBack) {
        this.classData.push({ betName, callBack });
    }
}
exports.Root = Root;
