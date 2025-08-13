import express, { Request, Response, Router } from 'express';
import { LoanService } from '../services';
import { ServiceErrorCode } from '../services/service.result';

export class LoanController {

    async getAllLoans(req: Request, res: Response): Promise<void> {
        try {
            const result = await LoanService.getAllLoans();
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching loans:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getLoanById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const numericId = parseInt(id);

            if (isNaN(numericId)) {
                res.status(400).json({ error: "Invalid ID" });
                return;
            }

            const result = await LoanService.getLoanById(numericId);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json(result.result);
            } else if (result.errorCode === ServiceErrorCode.notFound) {
                res.status(404).json({ error: "Loan not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching loan:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async createLoan(req: Request, res: Response): Promise<void> {
        try {
            const { loanerCarId, orNumber, customerId, startDate, endDate, notes } = req.body;
            if (!loanerCarId || !orNumber || !customerId || !startDate || !endDate || !notes) {
                res.status(400).json({ error: "loanerCarId, orNumber, customerId, startDate, endDate and notes are required" });
                return;
            }

            const result = await LoanService.createLoan(loanerCarId, orNumber, customerId, new Date(startDate), new Date(endDate), notes);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(201).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error creating loan:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async deleteLoan(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const numericId = parseInt(id);

            if (isNaN(numericId)) {
                res.status(400).json({ error: "Invalid ID" });
                return;
            }

            const result = await LoanService.deleteLoan(numericId);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json({ message: "Loan deleted successfully!" });
            } else if (result.errorCode === ServiceErrorCode.notFound) {
                res.status(404).json({ error: "Loan not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error deleting loan:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', this.getAllLoans.bind(this));
        router.get('/:id', this.getLoanById.bind(this));
        router.post('/', this.createLoan.bind(this));
        router.delete('/:id', this.deleteLoan.bind(this));
        return router;
    }
} 