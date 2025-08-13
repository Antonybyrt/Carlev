import { SecurityUtils } from "../utils/crypto";
import { User, UserSession } from "../models";
import { ServiceResult } from "./service.result";

export class AuthService {

    static async login(login: string, password: string): Promise<{ sessionToken: string }> {
        try {
            console.log(`Tentative de connexion pour l'email: ${login}`);
            console.log(`Password hashé reçu: ${password.substring(0, 10)}...`);
            
            const user = await User.findOne({
                where: { email: login, pw: password },
            });

            if (!user) {
                console.log(`Utilisateur non trouvé pour l'email: ${login}`);

                const emailExists = await User.findOne({ where: { email: login } });
                if (emailExists) {
                    console.log(`Email trouvé mais mot de passe incorrect`);
                } else {
                    console.log(`Email non trouvé en base`);
                }
                throw new Error("Invalid login or password");
            }

            console.log(`Utilisateur trouvé: ${user.firstName} ${user.lastName}`);

            const sessionToken = SecurityUtils.randomToken();

            const expirationDate = new Date(Date.now() + 1800000);

            await UserSession.create({
                token: sessionToken,
                expirationDate,
                user_id: user.id,
            });

            return { sessionToken };
        } catch (error) {
            console.error("Login failed:", error);
            throw new Error("Login failed. Please try again.");
        }
    }

    static async getSession(token: string): Promise<ServiceResult<UserSession>> {
        try {
            const session = await UserSession.findOne({
                where: {
                    token,
                    expirationDate: { $gt: new Date() },
                },
                include: [
                    {
                        model: User,
                        as: "user",
                    },
                ],
            });

            if (!session) {
                return ServiceResult.notFound();
            }

            return ServiceResult.success(session);
        } catch (error) {
            console.error("Get session failed:", error);
            return ServiceResult.failed();
        }
    }
}

export default new AuthService();
