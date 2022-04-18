"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Blockchain_1 = require("../Src/classes/Blockchain/Blockchain");
var Nodes_1 = require("../Src/classes/Network/Nodes");
var Wallet_1 = require("../Src/classes/Blockchain/Wallet");
var TransactionPool_1 = require("../Src/classes/Blockchain/TransactionPool");
var TransactionMiner_1 = require("../Src/classes/Blockchain/TransactionMiner");
var commander_1 = require("commander");
var net_1 = require("net");
var cluster_1 = __importDefault(require("cluster"));
var root_1 = __importDefault(require("./root"));
var nodes_1 = __importDefault(require("./nodes"));
var sign_1 = require("../Src/Addon/sign");
var blockChain;
var port = Math.floor(Math.random() * 10000);
var nodes = new Nodes_1.Nodes(port);
var transactionPool = new TransactionPool_1.TransactionPool();
var transactionMiner;
blockChain = new Blockchain_1.Blockchain();
var mainWallet = new Wallet_1.Wallet();
transactionMiner = new TransactionMiner_1.TransactionMiner(transactionPool, blockChain, mainWallet, nodes);
var cli = new commander_1.Command();
var Wallets = [];
var thisSocket;
cli.version("1.0.0");
cli
    .command("start")
    .description("start the node")
    .option("-a, --api", "enable api response")
    .action(function (option) {
    (0, root_1["default"])(blockChain, nodes, transactionPool, port + 2);
    (0, nodes_1["default"])(nodes, blockChain, transactionPool);
    setTimeout(function () {
        if (option.api) {
            return thisSocket.write(JSON.stringify({
                msg: {
                    status: "started",
                    mainWallet: {
                        publicKey: mainWallet.publicKey,
                        privateKey: mainWallet.privateKey
                    }
                }
            }));
        }
        thisSocket.write(JSON.stringify({
            msg: "node has been started. \n your main Wallet publicKey is: ".concat(mainWallet.publicKey, " \n your main Wallet privateKey is: ").concat(mainWallet.privateKey)
        }));
    });
});
cli
    .command("wallet")
    .description("manage your node wallets")
    .option("-a, --api", "enable api response")
    .option("-c, --create", "create a wallet")
    .option("-b, --balance <publicKey>", "balance of wallet with address")
    .action(function (option) {
    if (option.create) {
        var wallet = new Wallet_1.Wallet();
        if (option.api) {
            return thisSocket.write(JSON.stringify({
                msg: {
                    status: "created",
                    wallet: {
                        publicKey: wallet.publicKey,
                        privateKey: wallet.privateKey
                    }
                }
            }));
        }
        console.log("wallet created with publicKey: ".concat(wallet.publicKey, "\n and privateKey: ").concat(wallet.privateKey));
    }
    if (option.balance) {
        Wallet_1.Wallet.calculateBalance(blockChain.chain, option.balance);
    }
});
cli
    .command("mine")
    .description("start mining")
    .option("-a, --api", "enable api response")
    .option("-c, --core <number>", "select cpu core for mining")
    .action(function (option) {
    option.core = option.core ? option.core : 0;
    if (cluster_1["default"].isPrimary) {
        for (var i = 0; i < option.core; i++) {
            cluster_1["default"].fork();
        }
    }
    else {
        var starter_1 = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                transactionMiner.mineTransaction().then(function () {
                    console.dir("mine block in ".concat(Date.now()));
                    starter_1();
                });
                return [2 /*return*/];
            });
        }); };
        starter_1();
    }
    if (option.api) {
        return console.log(JSON.stringify({ status: "started", miner: process.pid }));
    }
    console.log("mining started in " + process.pid);
});
cli
    .command("transaction")
    .description("manage your node transactions")
    .option("-a, --api", "enable api response")
    .option("-fpub,--fromPublic <publicKey>", "from public address")
    .option("-fpri,--fromPrivate <privateKey>", "from private address")
    .option("-tpub,--toPublic <publicKey>", "to public address")
    .option("-v,--value <number>", "Transfer Value")
    .action(function (option) {
    if (option.fromPublic &&
        option.fromPrivate &&
        option.value &&
        option.toPublic) {
        var wallet = new Wallet_1.Wallet();
        wallet.keyPair = (0, sign_1.recoveryKeyPair)(option.fromPrivate, option.fromPublic);
        wallet.privateKey = option.fromPrivate;
        wallet.publicKey = option.fromPublic;
        var add = wallet.createTransaction(option.toPublic, option.value, blockChain.chain);
        if (add === null || add === void 0 ? void 0 : add.code) {
            if (option.api) {
                return console.log(add);
            }
            return console.log(add === null || add === void 0 ? void 0 : add.message);
        }
        transactionPool.add(add);
        if (option.api) {
            return console.log(JSON.stringify(""));
        }
    }
});
var server = (0, net_1.createServer)();
server.on("connection", function (socket) {
    thisSocket = socket;
    socket.on("data", function (data) {
        data = data.toString();
        thisSocket = socket;
        cli.parse(data);
    });
});
