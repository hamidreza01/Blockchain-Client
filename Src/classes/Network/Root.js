"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Root = void 0;
var config_1 = require("../../../config");
var net_1 = __importDefault(require("net"));
var Root = /** @class */ (function () {
    function Root(port) {
        this.port = port;
        this.classData = [
            {
                betName: "genesis",
                callBack: function () {
                    console.log('oops, im genesis');
                }
            },
        ];
        this.client = net_1["default"].createConnection({
            port: config_1.config.ROOT_PORT,
            host: config_1.config.ROOT_URL,
            localPort: port
        });
    }
    Root.prototype.start = function () {
        var _this = this;
        this.client.on("data", function (data) {
            console.dir(data.toString());
            try {
                data = JSON.parse(data.toString());
            }
            catch (error) {
                console.log(error);
            }
            var better = _this.classData.find(function (x) {
                return x.betName === data.action;
            });
            if (better) {
                better.callBack(data.data ? data.data : undefined);
            }
        });
        return new Promise(function (res, rej) {
            _this.client.on("connect", function () {
                res(true);
            });
            _this.client.on("timeout", function () {
                rej({ message: "connect to the root server of timeout", code: 251 });
            });
            _this.client.on("error", function () {
                rej({ message: "error connecting to the root server", code: 250 });
            });
        });
    };
    Root.prototype.addMe = function () {
        this.client.write(JSON.stringify({ action: "addMe" }));
        this.client.on("timeout", function () {
            return { message: "connect to the root server of timeout", code: 251 };
        });
        this.client.on("error", function () {
            return { message: "error connecting to the root server", code: 250 };
        });
    };
    Root.prototype.giveData = function (chain, nodeList) {
        this.client.write(JSON.stringify({ action: "giveMeData", data: { chain: chain, nodeList: nodeList } }));
        this.client.on("timeout", function () {
            return { message: "connect to the root server of timeout", code: 251 };
        });
        this.client.on("error", function () {
            return { message: "error connecting to the root server", code: 250 };
        });
    };
    Root.prototype.bet = function (betName, callBack) {
        this.classData.push({ betName: betName, callBack: callBack });
    };
    return Root;
}());
exports.Root = Root;
