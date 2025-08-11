import { Request, Response, NextFunction } from 'express';
import { UserSession } from '../models';
import { ServiceErrorCode, ServiceResult } from '../services/service.result';

export class AuthMiddleware {

    static async requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ 
                    error: 'Token d\'authentification manquant',
                    code: 'MISSING_TOKEN'
                });
                return;
            }

            const token = authHeader.split(' ')[1];
            
            if (!token) {
                res.status(401).json({ 
                    error: 'Token invalide',
                    code: 'INVALID_TOKEN'
                });
                return;
            }

            const session = await UserSession.findOne({
                where: { token }
            });

            if (!session) {
                res.status(401).json({ 
                    error: 'Session invalide',
                    code: 'INVALID_SESSION'
                });
                return;
            }

            const now = new Date();
            if (session.expirationDate < now) {
                await session.destroy();
                res.status(401).json({ 
                    error: 'Token expiré',
                    code: 'TOKEN_EXPIRED'
                });
                return;
            }

            (req as any).session = session;
            (req as any).userId = session.user_id;
            (req as any).token = token;

            next();
        } catch (error) {
            console.error('Erreur lors de la vérification d\'authentification:', error);
            res.status(500).json({ 
                error: 'Erreur interne du serveur',
                code: 'INTERNAL_ERROR'
            });
        }
    }

    static async optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                next();
                return;
            }

            const token = authHeader.split(' ')[1];
            
            if (!token) {
                next();
                return;
            }

            const session = await UserSession.findOne({
                where: { token }
            });

            if (session && session.expirationDate > new Date()) {
                (req as any).session = session;
                (req as any).userId = session.user_id;
                (req as any).token = token;
            }

            next();
        } catch (error) {
            console.error('Erreur lors de la vérification optionnelle d\'authentification:', error);
            next();
        }
    }

    static async requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.requireAuth(req, res, async () => {
                const userId = (req as any).userId;
                
                if (userId) {
                    next();
                } else {
                    res.status(403).json({ 
                        error: 'Accès refusé - Droits insuffisants',
                        code: 'INSUFFICIENT_PERMISSIONS'
                    });
                }
            });
        } catch (error) {
            console.error('Erreur lors de la vérification des droits admin:', error);
            res.status(500).json({ 
                error: 'Erreur interne du serveur',
                code: 'INTERNAL_ERROR'
            });
        }
    }
} 