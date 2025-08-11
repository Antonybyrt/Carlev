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
exports.CustomerController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const service_result_1 = require("../services/service.result");
class CustomerController {
    getCustomersByLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { login_id } = req.params;
                const numericLoginId = parseInt(login_id);
                if (isNaN(numericLoginId)) {
                    res.status(400).json({ error: "Invalid login_id" });
                    return;
                }
                const result = yield services_1.CustomerService.getCustomersByLogin(numericLoginId);
                if (result.errorCode === service_result_1.ServiceErrorCode.success) {
                    res.status(200).json(result.result);
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
            catch (error) {
                console.error("Error fetching customers:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    getAllCustomers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield services_1.CustomerService.getAllCustomers();
                if (result.errorCode === service_result_1.ServiceErrorCode.success) {
                    res.status(200).json(result.result);
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
            catch (error) {
                console.error("Error fetching customers:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    createCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { first_name, last_name } = req.body;
                const { login_id } = req.params;
                const numericLoginId = parseInt(login_id);
                if (!first_name || !last_name) {
                    res.status(400).json({ error: "first_name and last_name are required" });
                    return;
                }
                if (isNaN(numericLoginId)) {
                    res.status(400).json({ error: "Invalid login_id" });
                    return;
                }
                const result = yield services_1.CustomerService.createCustomer(first_name, last_name, numericLoginId);
                if (result.errorCode === service_result_1.ServiceErrorCode.success) {
                    res.status(201).json(result.result);
                }
                else if (result.errorCode === service_result_1.ServiceErrorCode.notFound) {
                    res.status(404).json({ error: "Login not found" });
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
            catch (error) {
                console.error("Error creating customer:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    deleteCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const numericId = parseInt(id);
                if (isNaN(numericId)) {
                    res.status(400).json({ error: "Invalid ID" });
                    return;
                }
                const result = yield services_1.CustomerService.deleteCustomer(numericId);
                if (result.errorCode === service_result_1.ServiceErrorCode.success) {
                    res.status(200).json({ message: "Customer deleted successfully" });
                }
                else if (result.errorCode === service_result_1.ServiceErrorCode.notFound) {
                    res.status(404).json({ error: "Customer not found" });
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
            catch (error) {
                console.error("Error deleting customer:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    getCustomerCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield services_1.CustomerService.getCustomerCount();
                if (result.errorCode === service_result_1.ServiceErrorCode.success) {
                    res.status(200).json({ count: result.result });
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
            catch (error) {
                console.error("Error fetching customer count:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.get('/customer/:login_id', this.getCustomersByLogin.bind(this));
        router.get('/', this.getAllCustomers.bind(this));
        router.post('/:login_id', this.createCustomer.bind(this));
        router.delete('/:id', this.deleteCustomer.bind(this));
        router.get('/count', this.getCustomerCount.bind(this));
        return router;
    }
}
exports.CustomerController = CustomerController;
