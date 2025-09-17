import express, { Request, Response, Router } from 'express';
import { OrderService } from '../services';
import { ServiceErrorCode } from '../services/service.result';

export class OrderController {

    async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const order = req.body;
            const result = await OrderService.createOrder(order);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(201).json({ newOrder: result.result });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error creating order:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getOrderDetails(req: Request, res: Response): Promise<void> {
        try {
            const result = await OrderService.getOrderDetails();
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getOrdersByAccount(req: Request, res: Response): Promise<void> {
        try {
            const result = await OrderService.getOrdersByAccount();
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching orders by account:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async deleteOrder(req: Request, res: Response): Promise<void> {
        try {
            const { order_id } = req.params;
            const numericOrderId = parseInt(order_id);

            if (isNaN(numericOrderId)) {
                res.status(400).json({ error: "Invalid order_id" });
                return;
            }

            const result = await OrderService.deleteOrder(numericOrderId);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json({ message: "Order deleted successfully" });
            } else if (result.errorCode === ServiceErrorCode.notFound) {
                res.status(404).json({ error: "Order not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error deleting order:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateOrder(req: Request, res: Response): Promise<void> {
        try {
            const { orderId } = req.params;
            const numericOrderId = parseInt(orderId);

            if (isNaN(numericOrderId)) {
                res.status(400).json({ error: "Invalid orderId" });
                return;
            }

            const orderData = req.body;
            const result = await OrderService.updateOrder(numericOrderId, orderData);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error updating order:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post("/orders", this.createOrder.bind(this));
        router.get("/orderDetails", this.getOrderDetails.bind(this));
        router.get("/byAccount", this.getOrdersByAccount.bind(this));
        router.delete('/delete/:order_id', this.deleteOrder.bind(this));
        router.put('/update/:orderId', this.updateOrder.bind(this));
        return router;
    }
} 