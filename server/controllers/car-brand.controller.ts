import express, { Request, Response, Router } from 'express';
import { CarBrandService } from '../services';
import { ServiceErrorCode } from '../services/service.result';

export class CarBrandController {

    async getAllCarBrands(req: Request, res: Response): Promise<void> {
        try {
            const result = await CarBrandService.getAllCarBrands();
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching car brands:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async createCarBrand(req: Request, res: Response): Promise<void> {
        try {
            const { brandName } = req.body;
            if (!brandName) {
                res.status(400).json({ error: "brand_name is required" });
                return;
            }

            const result = await CarBrandService.createCarBrand(brandName);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(201).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error creating car brand:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async deleteCarBrand(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const numericId = parseInt(id);

            if (isNaN(numericId)) {
                res.status(400).json({ error: "Invalid ID" });
                return;
            }

            const result = await CarBrandService.deleteCarBrand(numericId);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json({ message: "Car brand deleted successfully!" });
            } else if (result.errorCode === ServiceErrorCode.notFound) {
                res.status(404).json({ error: "Car brand not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error deleting car brand:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', this.getAllCarBrands.bind(this));
        router.post('/', this.createCarBrand.bind(this));
        router.delete('/:id', this.deleteCarBrand.bind(this));
        return router;
    }
} 