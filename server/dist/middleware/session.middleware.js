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
exports.SessionMiddleware = void 0;
const service_result_1 = require("../services/service.result");
const user_service_1 = require("../services/user.service");
class SessionMiddleware {
    static isLogged(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return false;
            }
            const token = authHeader.split(' ')[1];
            try {
                const user = yield user_service_1.UserService.getUserFromSession(token);
                if (user.errorCode === service_result_1.ServiceErrorCode.success) {
                    return true;
                }
                return false;
            }
            catch (error) {
                console.error("Error checking user permissions:", error);
                return false;
            }
        });
    }
    static getUserId(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return null;
            }
            const token = authHeader.split(' ')[1];
            try {
                const user = yield user_service_1.UserService.getUserFromSession(token);
                if (user.errorCode === service_result_1.ServiceErrorCode.success && user.result) {
                    return user.result.id;
                }
                return null;
            }
            catch (error) {
                console.error('Error retrieving user ID from session:', error);
                return null;
            }
        });
    }
}
exports.SessionMiddleware = SessionMiddleware;
