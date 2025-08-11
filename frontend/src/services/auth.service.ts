import axios from "axios";
import { ServiceResult, ServiceErrorCode } from "./service.result";
import { IUser } from "@/models/user.model";
import { ApiService } from "./api.service";
import { ErrorService } from "./error.service";

export default class auth {

    static async login(email: string, pw: string): Promise<{sessionToken: string} | null> {
        try {
            const res = await axios.post(`${ApiService.baseURL}/auth/login`, {
                    "email": email,
                    "pw": pw
            });
            
            if(res.status === 200) {
                localStorage.setItem("Token", res.data.sessionToken);
                return res.data;
            }
            return null;
        } catch(err: any) {
            if (err.response) {
                const status = err.response.status;
                const data = err.response.data;
                
                switch (status) {
                    case 400:
                        ErrorService.errorMessage("Erreur de saisie", "Veuillez vérifier vos informations de connexion");
                        break;
                    case 401:
                        ErrorService.errorMessage("Authentification échouée", "Email ou mot de passe incorrect");
                        break;
                    case 404:
                        ErrorService.errorMessage("Utilisateur non trouvé", "Aucun compte associé à cet email");
                        break;
                    case 500:
                        if (data && typeof data === 'string') {
                            if (data.includes("Invalid login or password") || data.includes("BAD PW/EMAIL")) {
                                ErrorService.errorMessage("Authentification échouée", "Email ou mot de passe incorrect");
                            } else {
                                ErrorService.errorMessage("Erreur serveur", data);
                            }
                        } else {
                            ErrorService.errorMessage("Erreur serveur", "Problème temporaire, veuillez réessayer");
                        }
                        break;
                    default:
                        ErrorService.errorMessage("Erreur de connexion", data?.error || "Une erreur inattendue s'est produite");
                }
            } else if (err.request) {
                ErrorService.errorMessage("Erreur de connexion", "Impossible de joindre le serveur. Vérifiez votre connexion internet.");
            } else {
                if (err.message && err.message.includes("Invalid login or password")) {
                    ErrorService.errorMessage("Authentification échouée", "Email ou mot de passe incorrect");
                } else {
                    ErrorService.errorMessage("Erreur de connexion", "Une erreur inattendue s'est produite");
                }
            }
            return null;
        }
    }

    static async isLogged(): Promise<ServiceResult<IUser>>{
        try {
            let token = localStorage.getItem("Token")
            if(token != null){
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
               const res = await axios.get(`${ApiService.baseURL}/user/${token}`);
               if(res.status === 200) {
                   return ServiceResult.success(res.data);
               } else {
                   return ServiceResult.notFound();
               }
            } else {
               return ServiceResult.notFound();
            }
        } catch (err: any) {
            if (err.response) {
                const status = err.response.status;
                
                switch (status) {
                    case 401:
                        ErrorService.warningMessage("Session expirée", "Veuillez vous reconnecter");
                        this.logout();
                        break;
                    case 403:
                        ErrorService.errorMessage("Accès refusé", "Vous n'avez pas les permissions nécessaires");
                        break;
                    case 404:
                        ErrorService.warningMessage("Utilisateur non trouvé", "Votre compte n'existe plus");
                        this.logout();
                        break;
                    default:
                        ErrorService.errorMessage("Erreur d'authentification", "Problème lors de la vérification de votre session");
                }
            } else if (err.request) {
                ErrorService.errorMessage("Erreur de connexion", "Impossible de joindre le serveur");
            }
            return ServiceResult.failed();
        }
    }

    static async getUser(): Promise<IUser | undefined> {
        const user = await auth.isLogged();

        if(user && user.errorCode === ServiceErrorCode.success) {
            return user.result;
        } else {
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
            return undefined;
        }
    }

    static async logout() {
        try {
            const token = localStorage.getItem("Token");
            if (token) {
                try {
                    await axios.post(`${ApiService.baseURL}/auth/logout`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } catch (err) {
                    console.log("Déconnexion côté serveur échouée, continuation côté client");
                }
            }
            
            localStorage.removeItem("Token");
            delete axios.defaults.headers.common["Authorization"];
            
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
        } catch (err) {
            console.error("Erreur lors de la déconnexion:", err);
            localStorage.removeItem("Token");
            delete axios.defaults.headers.common["Authorization"];
            
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
        }
    }

    static async validateToken(): Promise<boolean> {
        try {
            const token = localStorage.getItem("Token");
            if (!token) return false;
            
            const user = await this.isLogged();
            return user && user.errorCode === ServiceErrorCode.success;
        } catch (err) {
            return false;
        }
    }
}