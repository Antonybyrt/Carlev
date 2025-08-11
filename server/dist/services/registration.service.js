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
exports.RegistrationService = void 0;
const models_1 = require("../models");
const service_result_1 = require("./service.result");
class RegistrationService {
    static getAllRegistrations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const registrations = yield models_1.Registration.findAll();
                return service_result_1.ServiceResult.success(registrations);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static createRegistration(registrationName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newRegistration = yield models_1.Registration.create({
                    registrationName
                });
                return service_result_1.ServiceResult.success(newRegistration);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static deleteRegistration(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const registration = yield models_1.Registration.findByPk(id);
                if (!registration) {
                    return service_result_1.ServiceResult.notFound();
                }
                yield registration.destroy();
                return service_result_1.ServiceResult.success(true);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static getRegistrationCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield models_1.Registration.count();
                return service_result_1.ServiceResult.success(count);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
}
exports.RegistrationService = RegistrationService;
