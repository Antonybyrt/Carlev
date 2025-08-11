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
exports.OrderDetailService = void 0;
const models_1 = require("../models");
const service_result_1 = require("./service.result");
class OrderDetailService {
    static createOrderDetail(orderDetailData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdOrderDetail = yield models_1.OrderDetail.create(orderDetailData);
                return service_result_1.ServiceResult.success(createdOrderDetail);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static getAllOrderDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderDetails = yield models_1.OrderDetail.findAll({
                    include: [
                        {
                            model: models_1.Order,
                            as: 'order',
                        },
                        {
                            model: models_1.Item,
                            as: 'item',
                            attributes: ['id', 'itemName'],
                        },
                    ],
                });
                return service_result_1.ServiceResult.success(orderDetails);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
}
exports.OrderDetailService = OrderDetailService;
