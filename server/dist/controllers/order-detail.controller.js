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
exports.OrderDetailController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const service_result_1 = require("../services/service.result");
class OrderDetailController {
    createOrderDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderDetails = req.body;
                const result = yield services_1.OrderDetailService.createOrderDetail(orderDetails);
                if (result.errorCode === service_result_1.ServiceErrorCode.success) {
                    res.status(201).json(result.result);
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
            catch (error) {
                console.error("Error creating order detail:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    getAllOrderDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield services_1.OrderDetailService.getAllOrderDetails();
                if (result.errorCode === service_result_1.ServiceErrorCode.success) {
                    res.status(200).json(result.result);
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
            catch (error) {
                console.error("Error fetching order details:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.post("/", this.createOrderDetail.bind(this));
        router.get("/", this.getAllOrderDetails.bind(this));
        return router;
    }
}
exports.OrderDetailController = OrderDetailController;
