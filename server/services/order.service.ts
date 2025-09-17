import { Order, OrderDetail, Item, Customer, Login, CarBrand, CarModel, Supplier, Registration } from '../models';
import { ServiceResult } from './service.result';
import { fn, col } from 'sequelize';

export class OrderService {

    static async createOrder(orderData: any): Promise<ServiceResult<Order>> {
        try {
            const newOrder = await Order.create(orderData);
            return ServiceResult.success(newOrder);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async getOrderDetails(): Promise<ServiceResult<Order[]>> {
        try {
            const orders = await Order.findAll({
                attributes: ['id', 'creationDate', 'customerId', 'carBrandId', 'carModelId', 'supplierId', 'loginId', 'registrationId', 'notes'],
                include: [
                    {
                        model: OrderDetail,
                        as: 'orderDetails',
                        include: [
                            {
                                model: Item,
                                as: 'item',
                                attributes: ['id', 'itemName']
                            }
                        ]
                    },
                    {
                        model: Customer,
                        as: 'customer',
                        attributes: ['id', 'firstName', 'lastName'],
                    },
                    {
                        model: Login,
                        as: 'login',
                        attributes: ['id', 'loginName'],
                    },
                    {
                        model: CarBrand,
                        as: 'carBrand',
                        attributes: ['id', 'brandName'],
                    },
                    {
                        model: CarModel,
                        as: 'carModel',
                        attributes: ['id', 'modelName'],
                    },
                    {
                        model: Supplier,
                        as: 'supplier',
                        attributes: ['id', 'supplierName'],
                    },
                    {
                        model: Registration,
                        as: 'registration',
                        attributes: ['id', 'registrationName'],
                    },
                ],
                order: [['creationDate', 'DESC']],
            });
            return ServiceResult.success(orders);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async getOrdersByAccount(): Promise<ServiceResult<any[]>> {
        try {
            const ordersCount = await Order.findAll({
                attributes: [
                    [fn('COUNT', col('Order.id')), 'ordersCount']
                ],
                include: [
                    {
                        model: Login,
                        as: 'login',
                        attributes: ['loginName']
                    }
                ],
                group: ['login.loginName', 'login.id'],
            });

            const ordersPerAccount = ordersCount.map(order => {
                return {
                    accountName: order.login?.loginName,
                    orders: order.getDataValue('ordersCount')
                };
            });

            return ServiceResult.success(ordersPerAccount);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async deleteOrder(orderId: number): Promise<ServiceResult<boolean>> {
        try {
            const order = await Order.findByPk(orderId);
            if (!order) {
                return ServiceResult.notFound();
            }

            await OrderDetail.destroy({ where: { orderId } });
            await order.destroy();
            return ServiceResult.success(true);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async updateOrder(orderId: number, orderData: any): Promise<ServiceResult<Order>> {
        try {
            const order = await Order.findByPk(orderId);
            if (!order) {
                return ServiceResult.notFound();
            }
            await order.update(orderData);
            return ServiceResult.success(order);
        } catch (error) {
            return ServiceResult.failed();
        }
    }
} 