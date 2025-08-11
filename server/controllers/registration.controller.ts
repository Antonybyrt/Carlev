import express, { Request, Response, Router } from 'express';
import { RegistrationService } from '../services';
import { ServiceErrorCode } from '../services/service.result';

export class RegistrationController {

    async getAllRegistrations(req: Request, res: Response): Promise<void> {
        try {
            const result = await RegistrationService.getAllRegistrations();
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching registrations:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async createRegistration(req: Request, res: Response): Promise<void> {
        try {
            const { registration_name } = req.body;
            if (!registration_name) {
                res.status(400).json({ error: "registration_name is required" });
                return;
            }

            const result = await RegistrationService.createRegistration(registration_name);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(201).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error creating registration:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async deleteRegistration(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const numericId = parseInt(id);

            if (isNaN(numericId)) {
                res.status(400).json({ error: "Invalid ID" });
                return;
            }

            const result = await RegistrationService.deleteRegistration(numericId);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json({ message: "Registration deleted successfully!" });
            } else if (result.errorCode === ServiceErrorCode.notFound) {
                res.status(404).json({ error: "Registration not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error deleting registration:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getRegistrationCount(req: Request, res: Response): Promise<void> {
        try {
            const result = await RegistrationService.getRegistrationCount();
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json({ count: result.result });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching registration count:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', this.getAllRegistrations.bind(this));
        router.post('/', this.createRegistration.bind(this));
        router.delete('/:id', this.deleteRegistration.bind(this));
        router.get('/count', this.getRegistrationCount.bind(this));
        return router;
    }
} 