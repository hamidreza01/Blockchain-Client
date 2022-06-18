#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const axios_1 = __importDefault(require("axios"));
const ansicolor_1 = __importDefault(require("ansicolor"));
const cli = new commander_1.Command();
const line = ansicolor_1.default.red("\n" + "-".repeat(process.stdout.columns) + "\n");
cli.version("1.0.0");
cli
    .command("start")
    .description("start node")
    .option("-a, --api", "enable api response")
    .action((option) => {
    axios_1.default
        .post("http://127.0.0.1:7612/start")
        .then((res) => {
        if (option.api) {
            return console.log(JSON.stringify(res.data));
        }
        console.log(`${line} ${ansicolor_1.default.bright.green("node started")}\n  Admin Wallet :\n   Public Key : ${ansicolor_1.default.blue(res.data.mainWallet.publicKey)}\n   Private Key : ${ansicolor_1.default.red(res.data.mainWallet.privateKey)}${line}`);
    })
        .catch(() => { });
});
cli
    .command("chain")
    .description("manage your node chain")
    .option("-a, --api", "enable api response")
    .option("-l, --log", "save chain log")
    .option("-r, --restart", "restart chain")
    .action((option) => {
    if (option.restart) {
        axios_1.default
            .post("http://127.0.0.1:7612/restart")
            .then((res) => {
            if (option.api) {
                return console.log(JSON.stringify(res.data));
            }
            else if (!res.data.status) {
                return console.log(`${line} ${ansicolor_1.default.bright.green(res.data.message)}${line}`);
            }
            return console.log(`${line} ${ansicolor_1.default.bright.green("chain restarted")}\n${line}`);
        })
            .catch(() => { });
    }
    else if (option.log) {
        axios_1.default
            .post("http://127.0.0.1:7612/chain/log", {
            location: process.cwd() + "/chain.log",
        })
            .then((res) => {
            if (option.api) {
                return console.log(JSON.stringify(res.data));
            }
            else if (!res.data.status) {
                return console.log(`${line} ${ansicolor_1.default.bright.green(res.data.message)}${line}`);
            }
            console.log(`${line} ${ansicolor_1.default.bright.green("chain log saved")}\n  Location : ${ansicolor_1.default.blue(process.cwd() + "/chain.log")}${line}`);
        })
            .catch(() => { });
    }
});
cli
    .command("wallet")
    .description("manage your node wallets")
    .option("-a, --api", "enable api response")
    .option("-c, --create", "create a wallet")
    .option("-b, --balance <publicKey>", "balance of wallet with address")
    .action((option) => {
    if (option.create) {
        axios_1.default
            .post("http://127.0.0.1:7612/wallet/create")
            .then((res) => {
            if (option.api) {
                return console.log(JSON.stringify(res.data));
            }
            else if (!res.data.status) {
                return console.log(`${line} ${ansicolor_1.default.bright.green(res.data.message)}${line}`);
            }
            console.log(`${line} ${ansicolor_1.default.bright.green("wallet created")}\n  Wallet :\n   Public Key : ${ansicolor_1.default.blue(res.data.wallet.publicKey)}\n   Private Key : ${ansicolor_1.default.red(res.data.wallet.privateKey)}${line}`);
        })
            .catch(() => { });
    }
    else if (option.balance) {
        axios_1.default
            .post("http://127.0.0.1:7612/wallet/balance/" + option.balance)
            .then((res) => {
            if (option.api) {
                return console.log(JSON.stringify(res.data));
            }
            else if (!res.data.status) {
                return console.log(`${line} ${ansicolor_1.default.bright.green(res.data.message)}${line}`);
            }
            console.log(`${line} ${ansicolor_1.default.bright.green("wallet balance")}\n  Balance : ${ansicolor_1.default.blue(res.data.wallet.balance)}${line}`);
        })
            .then(() => { });
    }
});
cli
    .command("mine")
    .description("node mining manege")
    .option("-a, --api", "enable api response")
    .option("-c, --core <number>", "select cpu core for mining")
    .option("-s, --stop", "stop mining")
    .action((option) => {
    if (option.stop) {
        axios_1.default
            .post("http://127.0.0.1:7612/mine/stop")
            .then((res) => {
            if (option.api) {
                return console.log(JSON.stringify(res.data));
            }
            else if (!res.data.status) {
                return console.log(`${line} ${ansicolor_1.default.bright.green(res.data.message)}${line}`);
            }
            console.log(`${line} ${ansicolor_1.default.bright.green("mining stopped")}${line}`);
        })
            .catch((err) => {
        });
    }
    else if (option.core) {
        axios_1.default
            .post("http://127.0.0.1:7612/mine/start/" + option.core)
            .then((res) => {
            if (option.api) {
                return console.log(JSON.stringify(res.data));
            }
            console.log(`${line} ${ansicolor_1.default.bright.green("mining started")}${line}`);
        })
            .catch(() => { });
    }
    else {
        axios_1.default
            .post("http://127.0.0.1:7612/mine/start/1")
            .then((res) => {
            if (option.api) {
                return console.log(JSON.stringify(res.data));
            }
            console.log(`${line} ${ansicolor_1.default.bright.green("mining started")}${line}`);
        })
            .catch(() => { });
    }
});
cli
    .command("transaction")
    .description("manage your node transactions")
    .option("-a, --api", "enable api response")
    .option("-fpub,--fromPublic <publicKey>", "from public address")
    .option("-fpri,--fromPrivate <privateKey>", "from private address")
    .option("-tpub,--toPublic <publicKey>", "to public address")
    .option("-v,--value <number>", "Transfer Value")
    .action((option) => {
    if (option.fromPublic &&
        option.toPublic &&
        option.fromPrivate &&
        option.value) {
        axios_1.default
            .post("http://127.0.0.1:7612/transaction", {
            fromPublicKey: option.fromPublic,
            fromPrivateKey: option.fromPrivate,
            toPublic: option.toPublic,
            amount: option.value,
        })
            .then((res) => {
            if (option.api) {
                return console.log(JSON.stringify(res.data));
            }
            else if (!res.data.status) {
                return console.log(`${line} ${ansicolor_1.default.bright.green(res.data.message)}${line}`);
            }
            console.log(`${line} ${ansicolor_1.default.bright.green("transaction created")}${line}`);
        })
            .catch((err) => { console.log(err); });
    }
});
cli.parse(process.argv);
