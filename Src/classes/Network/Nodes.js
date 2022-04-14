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
exports.Nodes = void 0;
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
var Nodes = /** @class */ (function () {
    function Nodes(port) {
        this.port = port;
        this.list = [""];
        this.app = (0, express_1["default"])();
        this.classData = [];
    }
    Nodes.prototype.start = function (blockChain) {
        var _this = this;
        this.blockChain = blockChain;
        this.app.use(express_1["default"].json());
        this.app.post("/addBlock", function (req, res) {
            _this.blockChain.addBlock(['test']);
            _this.broadcast("chain", _this.blockChain.chain);
            res.send(_this.blockChain.chian);
        });
        this.app.post("/blocks", function (req, res) {
            res.send(_this.blockChain.chain);
        });
        this.app.listen(this.port, function () {
            console.log("Api run in", _this.port);
        });
    };
    Nodes.prototype.broadcast = function (name, data) {
        return __awaiter(this, void 0, void 0, function () {
            var i, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.list.length)) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1["default"].post("http://".concat(this.list[i], "/").concat(name), data)];
                    case 3:
                        _a.sent();
                        console.log("success send ".concat(this.list[i], " with ").concat(name, " channel"));
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.log("Error brodcast to ".concat(this.list[i], " with ").concat(name, " channel"));
                        return [3 /*break*/, 5];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Nodes.prototype.bet = function (name, callback) {
        this.app.use(express_1["default"].json());
        this.app.post("/" + name, function (req, res) {
            callback(req.body);
            res.send("ok");
        });
    };
    return Nodes;
}());
exports.Nodes = Nodes;
