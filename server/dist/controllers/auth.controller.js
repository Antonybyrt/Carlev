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
exports.AuthController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const crypto_1 = require("../utils/crypto");
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let email = req.body.email;
            let pw = req.body.pw;
            try {
                const token = yield services_1.AuthService.login(email, crypto_1.SecurityUtils.toSHA256(pw));
                if (token) {
                    res.status(200).send(token);
                }
                else {
                    res.status(500).send("BAD PW/EMAIL");
                }
            }
            catch (error) {
                res.status(500).send("Error login");
            }
        });
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.post('/login', this.login.bind(this));
        return router;
    }
}
exports.AuthController = AuthController;
