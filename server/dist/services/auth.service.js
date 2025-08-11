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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const crypto_1 = require("../utils/crypto");
const models_1 = require("../models");
const service_result_1 = require("./service.result");
class AuthService {
    static login(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield models_1.User.findOne({
                    where: { email: login, pw: password },
                });
                if (!user) {
                    throw new Error("Invalid login or password");
                }
                const sessionToken = crypto_1.SecurityUtils.randomToken();
                const expirationDate = new Date(Date.now() + 1800000);
                yield models_1.UserSession.create({
                    token: sessionToken,
                    expirationDate,
                    user_id: user.id,
                });
                return { sessionToken };
            }
            catch (error) {
                console.error("Login failed:", error);
                throw new Error("Login failed. Please try again.");
            }
        });
    }
    static getSession(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield models_1.UserSession.findOne({
                    where: {
                        token,
                        expirationDate: { $gt: new Date() },
                    },
                    include: [
                        {
                            model: models_1.User,
                            as: "user",
                        },
                    ],
                });
                if (!session) {
                    return service_result_1.ServiceResult.notFound();
                }
                return service_result_1.ServiceResult.success(session);
            }
            catch (error) {
                console.error("Get session failed:", error);
                return service_result_1.ServiceResult.failed();
            }
        });
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
