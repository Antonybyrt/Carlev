import { SecurityUtils } from "../utils/crypto";
import { User, UserSession } from "../models";
import { ServiceResult } from "./service.result";

export class AuthService {

    static async login(login: string, password: string): Promise<{ sessionToken: string }> {
        try {
            console.log(`Tentative de connexion pour l'email: ${login}`);
            console.log(`Password hashé reçu: ${password.substring(0, 10)}...`);
            
            // Debug: Afficher tous les utilisateurs pour voir ce qui est en base
            const allUsers = await User.findAll();
            console.log('=== TOUS LES UTILISATEURS EN BASE ===');
            allUsers.forEach(user => {
                console.log(`ID: ${user.id}, Email: ${user.email}, Password: ${user.pw}`);
            });
            console.log('=====================================');
            
            // Debug: Test de la requête étape par étape
            console.log('=== TEST REQUÊTE ÉTAPE PAR ÉTAPE ===');
            
            // Test 1: Recherche par email seulement
            const userByEmail = await User.findOne({ where: { email: login } });
            console.log('Test 1 - Recherche par email:', userByEmail ? 'TROUVÉ' : 'NON TROUVÉ');
            if (userByEmail && userByEmail.pw) {
                console.log('Email trouvé, password en base:', userByEmail.pw);
                console.log('Password reçu:', password);
                console.log('Sont-ils identiques?', userByEmail.pw === password);
                console.log('Longueur password base:', userByEmail.pw.length);
                console.log('Longueur password reçu:', password.length);
            }
            
            // Test 2: Recherche par password seulement
            const userByPassword = await User.findOne({ where: { pw: password } });
            console.log('Test 2 - Recherche par password:', userByPassword ? 'TROUVÉ' : 'NON TROUVÉ');
            
            // Test 3: Recherche avec les deux critères
            const user = await User.findOne({
                where: { email: login, pw: password },
            });
            console.log('Test 3 - Recherche par email + password:', user ? 'TROUVÉ' : 'NON TROUVÉ');
            console.log('=====================================');

            if (!user) {
                console.log(`Utilisateur non trouvé pour l'email: ${login}`);

                const emailExists = await User.findOne({ where: { email: login } });
                if (emailExists) {
                    console.log(`Email trouvé mais mot de passe incorrect`);
                    console.log(`Password en base pour cet email: ${emailExists.pw}`);
                    console.log(`Password reçu (hashé): ${password}`);
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
