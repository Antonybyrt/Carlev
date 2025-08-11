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
exports.UserController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const service_result_1 = require("../services/service.result");
class UserController {
    getUserFromSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.params.token;
            try {
                const user = yield services_1.UserService.getUserFromSession(token);
                if (user.errorCode == service_result_1.ServiceErrorCode.success) {
                    res.status(200).json(user.result);
                }
                else {
                    res.status(500).send("Error fetching user");
                }
            }
            catch (error) {
                console.error("Error fetching user:", error);
                res.status(500).send("Error fetching user");
            }
        });
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.get('/:token', this.getUserFromSession.bind(this));
        return router;
    }
}
exports.UserController = UserController;
