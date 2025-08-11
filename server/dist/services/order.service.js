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
exports.OrderService = void 0;
const models_1 = require("../models");
const service_result_1 = require("./service.result");
const sequelize_1 = require("sequelize");
class OrderService {
    static createOrder(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newOrder = yield models_1.Order.create(orderData);
                return service_result_1.ServiceResult.success(newOrder);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static getOrderDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield models_1.Order.findAll({
                    include: [
                        {
                            model: models_1.OrderDetail,
                            as: 'orderDetails',
                            include: [
                                {
                                    model: models_1.Item,
                                    as: 'item',
                                    attributes: ['id', 'itemName']
                                }
                            ]
                        },
                        {
                            model: models_1.Customer,
                            as: 'customer',
                            attributes: ['id', 'firstName', 'lastName'],
                        },
                        {
                            model: models_1.Login,
                            as: 'login',
                            attributes: ['id', 'loginName'],
                        },
                        {
                            model: models_1.CarBrand,
                            as: 'carBrand',
                            attributes: ['id', 'brandName'],
                        },
                        {
                            model: models_1.CarModel,
                            as: 'carModel',
                            attributes: ['id', 'modelName'],
                        },
                        {
                            model: models_1.Supplier,
                            as: 'supplier',
                            attributes: ['id', 'supplierName'],
                        },
                        {
                            model: models_1.Registration,
                            as: 'registration',
                            attributes: ['id', 'registrationName'],
                        },
                    ],
                    order: [['creationDate', 'DESC']],
                });
                return service_result_1.ServiceResult.success(orders);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static getOrdersByAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ordersCount = yield models_1.Order.findAll({
                    attributes: [
                        [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('Order.id')), 'ordersCount']
                    ],
                    include: [
                        {
                            model: models_1.Login,
                            as: 'login',
                            attributes: ['loginName']
                        }
                    ],
                    group: ['login.loginName', 'login.id'],
                });
                const ordersPerAccount = ordersCount.map(order => {
                    var _a;
                    return {
                        accountName: (_a = order.login) === null || _a === void 0 ? void 0 : _a.loginName,
                        orders: order.getDataValue('ordersCount')
                    };
                });
                return service_result_1.ServiceResult.success(ordersPerAccount);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
    static deleteOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield models_1.Order.findByPk(orderId);
                if (!order) {
                    return service_result_1.ServiceResult.notFound();
                }
                yield models_1.OrderDetail.destroy({ where: { orderId } });
                yield order.destroy();
                return service_result_1.ServiceResult.success(true);
            }
            catch (error) {
                return service_result_1.ServiceResult.failed();
            }
        });
    }
}
exports.OrderService = OrderService;
