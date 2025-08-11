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
exports.ItemService = void 0;
const models_1 = require("../models");
const service_result_1 = require("./service.result");
class ItemService {
    static getAllItems() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield models_1.Item.findAll();
                return service_result_1.ServiceResult.success(items);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static createItem(itemName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newItem = yield models_1.Item.create({
                    itemName
                });
                return service_result_1.ServiceResult.success(newItem);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static deleteItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield models_1.Item.findByPk(id);
                if (!item) {
                    return service_result_1.ServiceResult.notFound();
                }
                yield item.destroy();
                return service_result_1.ServiceResult.success(true);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
}
exports.ItemService = ItemService;
