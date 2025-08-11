import express, { Request, Response, Router } from 'express';
import { SupplierService } from '../services';
import { ServiceErrorCode } from '../services/service.result';

export class SupplierController {

    async getAllSuppliers(req: Request, res: Response): Promise<void> {
        try {
            const result = await SupplierService.getAllSuppliers();
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async createSupplier(req: Request, res: Response): Promise<void> {
        try {
            const { supplier_name } = req.body;
            if (!supplier_name) {
                res.status(400).json({ error: "supplier_name is required" });
                return;
            }

            const result = await SupplierService.createSupplier(supplier_name);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(201).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error creating supplier:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async deleteSupplier(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const numericId = parseInt(id);

            if (isNaN(numericId)) {
                res.status(400).json({ error: "Invalid ID" });
                return;
            }

            const result = await SupplierService.deleteSupplier(numericId);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json({ message: "Supplier deleted successfully!" });
            } else if (result.errorCode === ServiceErrorCode.notFound) {
                res.status(404).json({ error: "Supplier not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error deleting supplier:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getSupplierCount(req: Request, res: Response): Promise<void> {
        try {
            const result = await SupplierService.getSupplierCount();
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json({ count: result.result });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching supplier count:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', this.getAllSuppliers.bind(this));
        router.post('/', this.createSupplier.bind(this));
        router.delete('/:id', this.deleteSupplier.bind(this));
        router.get('/count', this.getSupplierCount.bind(this));
        return router;
    }
} 