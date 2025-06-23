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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var viem_1 = require("viem");
require("viem/window");
var constants_js_js_1 = require("./constants-js.js");
// DOM 요소 타입 정의
var connectWalletButton = document.getElementById("connect-wallet-button");
var getBalanceButton = document.getElementById("balance-button");
var withdrawButton = document.getElementById("withdraw-button");
var connectedWalletAddressesList = document.getElementById("connected-wallet-addresses");
var fundButton = document.getElementById("fund-button");
var ethAmountInput = document.getElementById("eth-amount");
// 전역 변수 타입 정의
var walletClient;
var publicClient;
/**
 * 지갑 연결
 */
var connectWallet = function () { return __awaiter(void 0, void 0, void 0, function () {
    var connectedWalletAddresses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("connectWallet");
                if (!(typeof window.ethereum !== "undefined")) return [3 /*break*/, 2];
                walletClient = (0, viem_1.createWalletClient)({
                    transport: (0, viem_1.custom)(window.ethereum)
                });
                console.log(walletClient);
                return [4 /*yield*/, walletClient.requestAddresses()];
            case 1:
                connectedWalletAddresses = _a.sent();
                connectedWalletAddresses.forEach(function (address) {
                    var li = document.createElement("li");
                    li.innerHTML = address;
                    connectedWalletAddressesList.appendChild(li);
                });
                connectWalletButton.innerHTML = "Connected";
                return [3 /*break*/, 3];
            case 2:
                connectWalletButton.innerHTML = "Please Install Metamask";
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * 펀딩
 */
var fund = function () { return __awaiter(void 0, void 0, void 0, function () {
    var ethAmount, connectedWalletAddress, currentChain, request, txHash, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ethAmount = ethAmountInput.value;
                console.log("funding with ".concat(ethAmount, " ETH"));
                if (!(typeof window.ethereum !== "undefined")) return [3 /*break*/, 8];
                walletClient = (0, viem_1.createWalletClient)({
                    transport: (0, viem_1.custom)(window.ethereum)
                });
                publicClient = (0, viem_1.createPublicClient)({
                    transport: (0, viem_1.custom)(window.ethereum)
                });
                return [4 /*yield*/, walletClient.requestAddresses()];
            case 1:
                connectedWalletAddress = (_a.sent())[0];
                return [4 /*yield*/, getCurrentChain(publicClient)];
            case 2:
                currentChain = _a.sent();
                _a.label = 3;
            case 3:
                _a.trys.push([3, 6, , 7]);
                return [4 /*yield*/, publicClient.simulateContract({
                        address: constants_js_js_1.contractAddress,
                        abi: constants_js_js_1.abi,
                        functionName: "fund",
                        account: connectedWalletAddress,
                        chain: currentChain,
                        value: (0, viem_1.parseEther)(ethAmount),
                    })];
            case 4:
                request = (_a.sent()).request;
                console.log(request);
                return [4 /*yield*/, walletClient.writeContract(request)];
            case 5:
                txHash = _a.sent();
                console.log(txHash);
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.error("Fund transaction failed:", error_1);
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                connectWalletButton.innerHTML = "Please Install Metamask";
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); };
/**
 * 잔액 조회
 */
var getBalance = function () { return __awaiter(void 0, void 0, void 0, function () {
    var balance, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(typeof window.ethereum !== "undefined")) return [3 /*break*/, 4];
                publicClient = (0, viem_1.createPublicClient)({
                    transport: (0, viem_1.custom)(window.ethereum)
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, publicClient.getBalance({
                        address: constants_js_js_1.contractAddress,
                    })];
            case 2:
                balance = _a.sent();
                console.log((0, viem_1.formatEther)(balance));
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error("Failed to get balance:", error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * 출금
 */
var withdraw = function () { return __awaiter(void 0, void 0, void 0, function () {
    var account, currentChain, request, hash, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Withdrawing...");
                if (!(typeof window.ethereum !== "undefined")) return [3 /*break*/, 8];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                walletClient = (0, viem_1.createWalletClient)({
                    transport: (0, viem_1.custom)(window.ethereum),
                });
                publicClient = (0, viem_1.createPublicClient)({
                    transport: (0, viem_1.custom)(window.ethereum),
                });
                return [4 /*yield*/, walletClient.requestAddresses()];
            case 2:
                account = (_a.sent())[0];
                return [4 /*yield*/, getCurrentChain(publicClient)];
            case 3:
                currentChain = _a.sent();
                console.log("Processing transaction...");
                return [4 /*yield*/, publicClient.simulateContract({
                        account: account,
                        address: constants_js_js_1.contractAddress,
                        abi: constants_js_js_1.abi,
                        functionName: "withdraw",
                        chain: currentChain,
                    })];
            case 4:
                request = (_a.sent()).request;
                return [4 /*yield*/, walletClient.writeContract(request)];
            case 5:
                hash = _a.sent();
                console.log("Transaction processed: ", hash);
                return [3 /*break*/, 7];
            case 6:
                error_3 = _a.sent();
                console.error("Withdraw failed:", error_3);
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                withdrawButton.innerHTML = "Please install MetaMask";
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); };
/**
 * 현재 체인 정보 가져오기
 */
var getCurrentChain = function (client) { return __awaiter(void 0, void 0, void 0, function () {
    var chainId, currentChain;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("getCurrentChain");
                console.log(client);
                return [4 /*yield*/, client.getChainId()];
            case 1:
                chainId = _a.sent();
                currentChain = (0, viem_1.defineChain)({
                    id: chainId,
                    name: "Custom Chain",
                    nativeCurrency: {
                        name: "Ether",
                        symbol: "ETH",
                        decimals: 18,
                    },
                    rpcUrls: {
                        default: {
                            http: ["http://localhost:8545"],
                        },
                    },
                });
                return [2 /*return*/, currentChain];
        }
    });
}); };
// 이벤트 리스너 등록
connectWalletButton.addEventListener("click", connectWallet);
fundButton.addEventListener("click", fund);
getBalanceButton.addEventListener("click", getBalance);
withdrawButton.addEventListener("click", withdraw);
