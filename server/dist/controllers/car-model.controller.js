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
exports.CarModelController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const service_result_1 = require("../services/service.result");
class CarModelController {
    getCarModelsByBrand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { brand_id } = req.params;
                const numericBrandId = parseInt(brand_id);
                if (isNaN(numericBrandId)) {
                    res.status(400).json({ error: "Invalid brand_id" });
                    return;
                }
                const result = yield services_1.CarModelService.getCarModelsByBrand(numericBrandId);
                if (result.errorCode === service_result_1.ServiceErrorCode.success) {
                    res.status(200).json(result.result);
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
            catch (error) {
                console.error("Error fetching car models:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    createCarModel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { modelName } = req.body;
                const { brand_id } = req.params;
                const numericBrandId = parseInt(brand_id);
                if (!modelName) {
                    res.status(400).json({ error: "model_name is required" });
                    return;
                }
                if (isNaN(numericBrandId)) {
                    res.status(400).json({ error: "Invalid brand_id" });
                    return;
                }
                const result = yield services_1.CarModelService.createCarModel(modelName, numericBrandId);
                if (result.errorCode === service_result_1.ServiceErrorCode.success) {
                    res.status(201).json(result.result);
                }
                else if (result.errorCode === service_result_1.ServiceErrorCode.notFound) {
                    res.status(404).json({ error: "Car brand not found" });
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
            catch (error) {
                console.error("Error creating car model:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    deleteCarModel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const numericId = parseInt(id);
                if (isNaN(numericId)) {
                    res.status(400).json({ error: "Invalid ID" });
                    return;
                }
                const result = yield services_1.CarModelService.deleteCarModel(numericId);
                if (result.errorCode === service_result_1.ServiceErrorCode.success) {
                    res.status(200).json({ message: "Model deleted successfully" });
                }
                else if (result.errorCode === service_result_1.ServiceErrorCode.notFound) {
                    res.status(404).json({ error: "Model not found" });
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
            catch (error) {
                console.error("Error deleting car model:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.get('/models/:brand_id', this.getCarModelsByBrand.bind(this));
        router.post('/:brand_id', this.createCarModel.bind(this));
        router.delete('/:id', this.deleteCarModel.bind(this));
        return router;
    }
}
exports.CarModelController = CarModelController;
