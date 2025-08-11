import express, { Request, Response, Router } from 'express';
import { CustomerService } from '../services';
import { ServiceErrorCode } from '../services/service.result';

export class CustomerController {

    async getCustomersByLogin(req: Request, res: Response): Promise<void> {
        try {
            const { login_id } = req.params;
            const numericLoginId = parseInt(login_id);

            if (isNaN(numericLoginId)) {
                res.status(400).json({ error: "Invalid login_id" });
                return;
            }

            const result = await CustomerService.getCustomersByLogin(numericLoginId);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getAllCustomers(req: Request, res: Response): Promise<void> {
        try {
            const result = await CustomerService.getAllCustomers();
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async createCustomer(req: Request, res: Response): Promise<void> {
        try {
            const { first_name, last_name } = req.body;
            const { login_id } = req.params;
            const numericLoginId = parseInt(login_id);

            if (!first_name || !last_name) {
                res.status(400).json({ error: "first_name and last_name are required" });
                return;
            }

            if (isNaN(numericLoginId)) {
                res.status(400).json({ error: "Invalid login_id" });
                return;
            }

            const result = await CustomerService.createCustomer(first_name, last_name, numericLoginId);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(201).json(result.result);
            } else if (result.errorCode === ServiceErrorCode.notFound) {
                res.status(404).json({ error: "Login not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error creating customer:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async deleteCustomer(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const numericId = parseInt(id);

            if (isNaN(numericId)) {
                res.status(400).json({ error: "Invalid ID" });
                return;
            }

            const result = await CustomerService.deleteCustomer(numericId);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json({ message: "Customer deleted successfully" });
            } else if (result.errorCode === ServiceErrorCode.notFound) {
                res.status(404).json({ error: "Customer not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error deleting customer:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getCustomerCount(req: Request, res: Response): Promise<void> {
        try {
            const result = await CustomerService.getCustomerCount();
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json({ count: result.result });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching customer count:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/customer/:login_id', this.getCustomersByLogin.bind(this));
        router.get('/', this.getAllCustomers.bind(this));
        router.post('/:login_id', this.createCustomer.bind(this));
        router.delete('/:id', this.deleteCustomer.bind(this));
        router.get('/count', this.getCustomerCount.bind(this));
        return router;
    }
} 