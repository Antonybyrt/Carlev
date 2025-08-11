import { UserSession } from '../models';

declare global {
    namespace Express {
        interface Request {
            session?: UserSession;
            userId?: number;
            token?: string;
        }
    }
}

export {}; 