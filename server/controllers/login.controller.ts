import express, { Request, Response, Router } from 'express';
import { LoginService } from '../services';
import { ServiceErrorCode } from '../services/service.result';

export class LoginController {

    async getAllLogins(req: Request, res: Response): Promise<void> {
        try {
            const result = await LoginService.getAllLogins();
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching logins:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', this.getAllLogins.bind(this));
        return router;
    }
} 