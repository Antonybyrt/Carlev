import express, { Request, Response, Router } from 'express';
import { LoanService } from '../services';
import { ServiceErrorCode } from '../services/service.result';
import { ServiceResult } from '../services/service.result';

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
            if (!loanerCarId || !orNumber || !customerId || !startDate || !endDate) {
                res.status(400).json({ error: "loanerCarId, orNumber, customerId, startDate, and endDate are required" });
                return;
            }

            const loanData = {
                loanerCarId,
                orNumber,
                customerId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                notes: notes || undefined
            };

            const result = await LoanService.createLoan(loanData);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(201).json(result.result);
            } else if (result.errorCode === ServiceErrorCode.conflict) {
                res.status(409).json({ error: "Conflit de dates : cette voiture a déjà un prêt sur cette période" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error creating loan:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async deleteLoan(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const loanId = parseInt(id);

            if (isNaN(loanId)) {
                return res.status(400).json(ServiceResult.failed());
            }

            const result = await LoanService.deleteLoan(loanId);
            
            if (result.errorCode === ServiceErrorCode.notFound) {
                return res.status(404).json(result);
            }
            
            if (result.errorCode !== ServiceErrorCode.success) {
                return res.status(500).json(result);
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Erreur lors de la suppression du prêt:', error);
            res.status(500).json(ServiceResult.failed());
        }
    }

    async updateLoan(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const loanId = parseInt(id);
            const updateData = req.body;

            if (isNaN(loanId)) {
                return res.status(400).json(ServiceResult.failed());
            }

            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).json(ServiceResult.failed());
            }

            const result = await LoanService.updateLoan(loanId, updateData);
            
            if (result.errorCode === ServiceErrorCode.notFound) {
                return res.status(404).json(result);
            } else if (result.errorCode === ServiceErrorCode.conflict) {
                return res.status(409).json({ error: "Conflit de dates : cette voiture a déjà un prêt sur cette période" });
            } else if (result.errorCode !== ServiceErrorCode.success) {
                return res.status(500).json(result);
            }

            res.status(200).json(result);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du prêt:', error);
            res.status(500).json(ServiceResult.failed());
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', this.getAllLoans.bind(this));
        router.get('/:id', this.getLoanById.bind(this));
        router.post('/', this.createLoan.bind(this));
        router.put('/:id', this.updateLoan.bind(this));
        router.delete('/:id', this.deleteLoan.bind(this));
        return router;
    }
} 