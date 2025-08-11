import express, { Request, Response, Router } from 'express';
import { CarModelService } from '../services';
import { ServiceErrorCode } from '../services/service.result';

export class CarModelController {

    async getCarModelsByBrand(req: Request, res: Response): Promise<void> {
        try {
            const { brand_id } = req.params;
            const numericBrandId = parseInt(brand_id);

            if (isNaN(numericBrandId)) {
                res.status(400).json({ error: "Invalid brand_id" });
                return;
            }

            const result = await CarModelService.getCarModelsByBrand(numericBrandId);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching car models:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async createCarModel(req: Request, res: Response): Promise<void> {
        try {
            const { modelName } = req.body;
            const { brand_id } = req.params;
            const numericBrandId = parseInt(brand_id);

            if (!modelName) {
                res.status(400).json({ error: "model_name is required" });
                return;
            }

            if (isNaN(numericBrandId)) {
                res.status(400).json({ error: "Invalid brand_id" });
                return;
            }

            const result = await CarModelService.createCarModel(modelName, numericBrandId);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(201).json(result.result);
            } else if (result.errorCode === ServiceErrorCode.notFound) {
                res.status(404).json({ error: "Car brand not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error creating car model:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async deleteCarModel(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const numericId = parseInt(id);

            if (isNaN(numericId)) {
                res.status(400).json({ error: "Invalid ID" });
                return;
            }

            const result = await CarModelService.deleteCarModel(numericId);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json({ message: "Model deleted successfully" });
            } else if (result.errorCode === ServiceErrorCode.notFound) {
                res.status(404).json({ error: "Model not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error deleting car model:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/models/:brand_id', this.getCarModelsByBrand.bind(this));
        router.post('/:brand_id', this.createCarModel.bind(this));
        router.delete('/:id', this.deleteCarModel.bind(this));
        return router;
    }
} 