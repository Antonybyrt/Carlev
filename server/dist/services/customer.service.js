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
exports.CustomerService = void 0;
const models_1 = require("../models");
const service_result_1 = require("./service.result");
class CustomerService {
    static getCustomersByLogin(loginId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customers = yield models_1.Customer.findAll({
                    where: { loginId }
                });
                return service_result_1.ServiceResult.success(customers);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static getAllCustomers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customers = yield models_1.Customer.findAll();
                return service_result_1.ServiceResult.success(customers);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static createCustomer(firstName, lastName, loginId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginExists = yield models_1.Login.findByPk(loginId);
                if (!loginExists) {
                    return service_result_1.ServiceResult.notFound();
                }
                const newCustomer = yield models_1.Customer.create({
                    firstName,
                    lastName,
                    loginId
                });
                return service_result_1.ServiceResult.success(newCustomer);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static deleteCustomer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield models_1.Customer.findByPk(id);
                if (!customer) {
                    return service_result_1.ServiceResult.notFound();
                }
                yield customer.destroy();
                return service_result_1.ServiceResult.success(true);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static getCustomerCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield models_1.Customer.count();
                return service_result_1.ServiceResult.success(count);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
}
exports.CustomerService = CustomerService;
