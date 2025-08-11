import express, { Request, Response, Router } from 'express';
import { OrderDetailService } from '../services';
import { ServiceErrorCode } from '../services/service.result';

export class OrderDetailController {

    async createOrderDetail(req: Request, res: Response): Promise<void> {
        try {
            const orderDetails = req.body;
            const result = await OrderDetailService.createOrderDetail(orderDetails);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(201).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error creating order detail:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getAllOrderDetails(req: Request, res: Response): Promise<void> {
        try {
            const result = await OrderDetailService.getAllOrderDetails();
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

    buildRoutes(): Router {
        const router = express.Router();
        router.post("/", this.createOrderDetail.bind(this));
        router.get("/", this.getAllOrderDetails.bind(this));
        return router;
    }
} 