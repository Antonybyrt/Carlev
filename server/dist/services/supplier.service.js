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
exports.SupplierService = void 0;
const models_1 = require("../models");
const service_result_1 = require("./service.result");
class SupplierService {
    static getAllSuppliers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const suppliers = yield models_1.Supplier.findAll();
                return service_result_1.ServiceResult.success(suppliers);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static createSupplier(supplierName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newSupplier = yield models_1.Supplier.create({
                    supplierName
                });
                return service_result_1.ServiceResult.success(newSupplier);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static deleteSupplier(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const supplier = yield models_1.Supplier.findByPk(id);
                if (!supplier) {
                    return service_result_1.ServiceResult.notFound();
                }
                yield supplier.destroy();
                return service_result_1.ServiceResult.success(true);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static getSupplierCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield models_1.Supplier.count();
                return service_result_1.ServiceResult.success(count);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
}
exports.SupplierService = SupplierService;
