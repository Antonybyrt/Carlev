"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const models_1 = require("../models");
class AuthMiddleware {
    static requireAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const session = yield models_1.UserSession.findOne({
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
                    yield session.destroy();
                    res.status(401).json({
                        error: 'Token expiré',
                        code: 'TOKEN_EXPIRED'
                    });
                    return;
                }
                req.session = session;
                req.userId = session.user_id;
                req.token = token;
                next();
            }
            catch (error) {
                console.error('Erreur lors de la vérification d\'authentification:', error);
                res.status(500).json({
                    error: 'Erreur interne du serveur',
                    code: 'INTERNAL_ERROR'
                });
            }
        });
    }
    static optionalAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const session = yield models_1.UserSession.findOne({
                    where: { token }
                });
                if (session && session.expirationDate > new Date()) {
                    req.session = session;
                    req.userId = session.user_id;
                    req.token = token;
                }
                next();
            }
            catch (error) {
                console.error('Erreur lors de la vérification optionnelle d\'authentification:', error);
                next();
            }
        });
    }
    static requireAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.requireAuth(req, res, () => __awaiter(this, void 0, void 0, function* () {
                    const userId = req.userId;
                    if (userId) {
                        next();
                    }
                    else {
                        res.status(403).json({
                            error: 'Accès refusé - Droits insuffisants',
                            code: 'INSUFFICIENT_PERMISSIONS'
                        });
                    }
                }));
            }
            catch (error) {
                console.error('Erreur lors de la vérification des droits admin:', error);
                res.status(500).json({
                    error: 'Erreur interne du serveur',
                    code: 'INTERNAL_ERROR'
                });
            }
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;
