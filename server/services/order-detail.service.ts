import { OrderDetail, Order, Item } from '../models';
import { ServiceResult } from './service.result';

export class OrderDetailService {

    static async createOrderDetail(orderDetailData: any): Promise<ServiceResult<OrderDetail>> {
        try {
            const createdOrderDetail = await OrderDetail.create(orderDetailData);
            return ServiceResult.success(createdOrderDetail);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async getAllOrderDetails(): Promise<ServiceResult<OrderDetail[]>> {
        try {
            const orderDetails = await OrderDetail.findAll({
                include: [
                    {
                        model: Order,
                        as: 'order',
                    },
                    {
                        model: Item,
                        as: 'item',
                        attributes: ['id', 'itemName'],
                    },
                ],
            });
            return ServiceResult.success(orderDetails);
        } catch (error) {
            return ServiceResult.failed();
        }
    }
} 