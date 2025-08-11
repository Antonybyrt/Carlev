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
exports.OrderController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const service_result_1 = require("../services/service.result");
class OrderController {
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = req.body;
                const result = yield services_1.OrderService.createOrder(order);
                if (result.errorCode === service_result_1.ServiceErrorCode.success) {
                    res.status(201).json({ newOrder: result.result });
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
            catch (error) {
                console.error("Error creating order:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    getOrderDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield services_1.OrderService.getOrderDetails();
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
    getOrdersByAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield services_1.OrderService.getOrdersByAccount();
                if (result.errorCode === service_result_1.ServiceErrorCode.success) {
                    res.status(200).json(result.result);
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
            catch (error) {
                console.error("Error fetching orders by account:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    deleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { order_id } = req.params;
                const numericOrderId = parseInt(order_id);
                if (isNaN(numericOrderId)) {
                    res.status(400).json({ error: "Invalid order_id" });
                    return;
                }
                const result = yield services_1.OrderService.deleteOrder(numericOrderId);
                if (result.errorCode === service_result_1.ServiceErrorCode.success) {
                    res.status(200).json({ message: "Order deleted successfully" });
                }
                else if (result.errorCode === service_result_1.ServiceErrorCode.notFound) {
                    res.status(404).json({ error: "Order not found" });
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
            catch (error) {
                console.error("Error deleting order:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.post("/orders", this.createOrder.bind(this));
        router.get("/orderDetails", this.getOrderDetails.bind(this));
        router.get("/byAccount", this.getOrdersByAccount.bind(this));
        router.delete('/delete/:order_id', this.deleteOrder.bind(this));
        return router;
    }
}
exports.OrderController = OrderController;
