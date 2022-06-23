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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nodes = void 0;
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
class Nodes {
    constructor(port) {
        this.port = port;
        this.list = [""];
        this.app = (0, express_1.default)();
    }
    start() {
        this.app.use(express_1.default.json());
        this.app.listen(this.port /*,"0.0.0.0"*/);
    }
    broadcast(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res) => __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < this.list.length; i++) {
                    try {
                        yield axios_1.default.post(`http://${this.list[i]}/${name}`, data);
                        console.log(`success send ${this.list[i]} with ${name} channel`);
                    }
                    catch (error) {
                        console.log(`Error brodcast to ${this.list[i]} with ${name} channel`);
                    }
                }
                res;
            }));
        });
    }
    bet(name, callback) {
        this.app.use(express_1.default.json());
        this.app.post("/" + name, (req, res) => {
            callback(req.body);
            res.send("ok");
        });
    }
}
exports.Nodes = Nodes;
