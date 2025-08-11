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
exports.CarBrandService = void 0;
const models_1 = require("../models");
const service_result_1 = require("./service.result");
class CarBrandService {
    static getAllCarBrands() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carBrands = yield models_1.CarBrand.findAll();
                return service_result_1.ServiceResult.success(carBrands);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static createCarBrand(brandName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCarBrand = yield models_1.CarBrand.create({
                    brandName
                });
                return service_result_1.ServiceResult.success(newCarBrand);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static deleteCarBrand(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carBrand = yield models_1.CarBrand.findByPk(id);
                if (!carBrand) {
                    return service_result_1.ServiceResult.notFound();
                }
                yield carBrand.destroy();
                return service_result_1.ServiceResult.success(true);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
}
exports.CarBrandService = CarBrandService;
