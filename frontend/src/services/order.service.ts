import axios from "axios";
import { ApiService } from "./api.service";
import { ServiceResult } from "./service.result";
import { IOrder } from "@/models/order.model";
import { IOrderDetail } from "@/models/order-detail.model";
import { ErrorService } from "./error.service";

export default class OrderService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("Token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static async createOrder(order: IOrder): Promise<ServiceResult<IOrder>> {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/orders/orders`,
        order,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 201) {
        ErrorService.successMessage("Commande créée", "Votre commande a été créée avec succès !");
        return ServiceResult.success(response.data.newOrder);
      } else {
        ErrorService.errorMessage("Erreur", "Impossible de créer la commande");
        return ServiceResult.failed();
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      
      if (error.response) {
        const status = error.response.status;
        switch (status) {
          case 400:
            ErrorService.errorMessage("Données invalides", "Veuillez vérifier les informations de la commande");
            break;
          case 401:
            ErrorService.errorMessage("Non autorisé", "Veuillez vous reconnecter");
            break;
          case 403:
            ErrorService.errorMessage("Accès refusé", "Vous n'avez pas les permissions pour créer une commande");
            break;
          case 500:
            ErrorService.errorMessage("Erreur serveur", "Problème temporaire, veuillez réessayer");
            break;
          default:
            ErrorService.errorMessage("Erreur", "Impossible de créer la commande");
        }
      } else if (error.request) {
        ErrorService.errorMessage("Erreur de connexion", "Impossible de joindre le serveur");
      } else {
        ErrorService.errorMessage("Erreur", "Une erreur inattendue s'est produite");
      }
      
      return ServiceResult.failed();
    }
  }

  static async getOrderDetails(): Promise<ServiceResult<IOrderDetail[]>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/orders/orderDetails`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        return ServiceResult.success(response.data);
      } else {
        ErrorService.errorMessage("Erreur", "Impossible de récupérer les détails de la commande");
        return ServiceResult.failed();
      }
    } catch (error: any) {
      console.error("Error fetching order details:", error);
      
      if (error.response?.status === 401) {
        ErrorService.warningMessage("Session expirée", "Veuillez vous reconnecter");
      } else {
        ErrorService.errorMessage("Erreur", "Impossible de récupérer les détails de la commande");
      }
      
      return ServiceResult.failed();
    }
  }

  static async getOrdersByAccount(): Promise<ServiceResult<IOrder[]>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/orders/byAccount`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        return ServiceResult.success(response.data);
      } else {
        ErrorService.errorMessage("Erreur", "Impossible de récupérer vos commandes");
        return ServiceResult.failed();
      }
    } catch (error: any) {
      console.error("Error fetching orders by account:", error);
      
      if (error.response?.status === 401) {
        ErrorService.warningMessage("Session expirée", "Veuillez vous reconnecter");
      } else {
        ErrorService.errorMessage("Erreur", "Impossible de récupérer vos commandes");
      }
      
      return ServiceResult.failed();
    }
  }

  static async deleteOrder(orderId: number): Promise<ServiceResult<string>> {
    try {
      const response = await axios.delete(
        `${ApiService.baseURL}/orders/delete/${orderId}`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        ErrorService.successMessage("Commande supprimée", "La commande a été supprimée avec succès");
        return ServiceResult.success(response.data.message);
      } else if (response.status === 404) {
        ErrorService.errorMessage("Commande non trouvée", "Cette commande n'existe pas");
        return ServiceResult.notFound();
      } else {
        ErrorService.errorMessage("Erreur", "Impossible de supprimer la commande");
        return ServiceResult.failed();
      }
    } catch (error: any) {
      console.error("Error deleting order:", error);
      
      if (error.response?.status === 401) {
        ErrorService.warningMessage("Session expirée", "Veuillez vous reconnecter");
      } else if (error.response?.status === 404) {
        ErrorService.errorMessage("Commande non trouvée", "Cette commande n'existe pas");
        return ServiceResult.notFound();
      } else {
        ErrorService.errorMessage("Erreur", "Impossible de supprimer la commande");
      }
      
      return ServiceResult.failed();
    }
  }
} 