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
exports.ItemController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const service_result_1 = require("../services/service.result");
class ItemController {
    getAllItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield services_1.ItemService.getAllItems();
                if (result.errorCode === service_result_1.ServiceErrorCode.success) {
                    res.status(200).json(result.result);
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
            catch (error) {
                console.error("Error fetching items:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    createItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { item_name } = req.body;
                if (!item_name) {
                    res.status(400).json({ error: "item_name is required" });
                    return;
                }
                const result = yield services_1.ItemService.createItem(item_name);
                if (result.errorCode === service_result_1.ServiceErrorCode.success) {
                    res.status(201).json(result.result);
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
            catch (error) {
                console.error("Error creating item:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    deleteItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const numericId = parseInt(id);
                if (isNaN(numericId)) {
                    res.status(400).json({ error: "Invalid ID" });
                    return;
                }
                const result = yield services_1.ItemService.deleteItem(numericId);
                if (result.errorCode === service_result_1.ServiceErrorCode.success) {
                    res.status(200).json({ message: "Item deleted successfully!" });
                }
                else if (result.errorCode === service_result_1.ServiceErrorCode.notFound) {
                    res.status(404).json({ error: "Item not found" });
                }
                else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
            catch (error) {
                console.error("Error deleting item:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.get('/', this.getAllItems.bind(this));
        router.post('/', this.createItem.bind(this));
        router.delete('/:id', this.deleteItem.bind(this));
        return router;
    }
}
exports.ItemController = ItemController;
