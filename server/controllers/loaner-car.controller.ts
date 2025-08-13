import express, { Request, Response, Router } from 'express';
import { LoanerCarService } from '../services';
import { ServiceErrorCode } from '../services/service.result';

export class LoanerCarController {

    async getAllLoanerCars(req: Request, res: Response): Promise<void> {
        try {
            const result = await LoanerCarService.getAllLoanerCars();
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching loaner cars:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getLoanerCarById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const numericId = parseInt(id);

            if (isNaN(numericId)) {
                res.status(400).json({ error: "Invalid ID" });
                return;
            }

            const result = await LoanerCarService.getLoanerCarById(numericId);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json(result.result);
            } else if (result.errorCode === ServiceErrorCode.notFound) {
                res.status(404).json({ error: "Loaner car not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching loaner car:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async createLoanerCar(req: Request, res: Response): Promise<void> {
        try {
            const { carBrandId, carModelId, registrationId, status } = req.body;
            if (!carBrandId || !carModelId || !registrationId || !status) {
                res.status(400).json({ error: "carBrandId, carModelId, registrationId and status are required" });
                return;
            }

            const result = await LoanerCarService.createLoanerCar(carBrandId, carModelId, registrationId, status);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(201).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error creating loaner car:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async deleteLoanerCar(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const numericId = parseInt(id);

            if (isNaN(numericId)) {
                res.status(400).json({ error: "Invalid ID" });
                return;
            }

            const result = await LoanerCarService.deleteLoanerCar(numericId);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json({ message: "Loaner car deleted successfully!" });
            } else if (result.errorCode === ServiceErrorCode.notFound) {
                res.status(404).json({ error: "Loaner car not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error deleting loaner car:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateLoanerCar(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!updateData || Object.keys(updateData).length === 0) {
                res.status(400).json({ error: "Aucune donnée à mettre à jour" });
                return;
            }

            const numericId = parseInt(id);
            if (isNaN(numericId)) {
                res.status(400).json({ error: "Invalid ID" });
                return;
            }

            const result = await LoanerCarService.updateLoanerCar(numericId, updateData);

            if (result.errorCode === ServiceErrorCode.notFound) {
                res.status(404).json({ error: "Loaner car not found" });
            } else if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json({
                    message: "Loaner car updated successfully!",
                    loanerCar: result.result
                });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error updating loaner car:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    buildRoutes(): Router {
        const router = Router();
        
        router.get('/', this.getAllLoanerCars.bind(this));
        router.get('/:id', this.getLoanerCarById.bind(this));
        router.post('/', this.createLoanerCar.bind(this));
        router.patch('/:id', this.deleteLoanerCar.bind(this));
        router.put('/:id', this.updateLoanerCar.bind(this));
        
        return router;
    }
} 