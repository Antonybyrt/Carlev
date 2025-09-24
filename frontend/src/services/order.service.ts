import axios from "axios";
import { ApiService } from "./api.service";
import { ServiceResult } from "./service.result";
import { IOrder, IOrderResponse, IOrderExtended } from "@/models/order.model";

export default class OrderService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("Token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static async createOrder(order: IOrder): Promise<ServiceResult<IOrderResponse>> {
    try {
      const response = await axios.post(`${ApiService.baseURL}/orders/orders`, order, {
        headers: this.getAuthHeaders(),
      });
      return ServiceResult.success(response.data);
    } catch (error: any) {
      if (error.response) {
        console.error("Erreur lors de la création de la commande:", error.response.data?.message);
        return ServiceResult.failed();
      }
      console.error("Erreur de connexion:", error);
      return ServiceResult.failed();
    }
  }

  static async getAllOrders(): Promise<ServiceResult<IOrderExtended[]>> {
    try {
      const response = await axios.get(`${ApiService.baseURL}/orders/orderDetails`, {
        headers: this.getAuthHeaders(),
      });
      return ServiceResult.success(response.data);
    } catch (error: any) {
      if (error.response) {
        console.error("Erreur lors de la récupération des commandes:", error.response.data?.message);
        return ServiceResult.failed();
      }
      console.error("Erreur de connexion:", error);
      return ServiceResult.failed();
    }
  }

  static async deleteOrder(orderId: number): Promise<ServiceResult<string>> {
    try {
      const response = await axios.delete(`${ApiService.baseURL}/orders/delete/${orderId}`, {
        headers: this.getAuthHeaders(),
      });
      return ServiceResult.success(response.data?.message || "Commande supprimée avec succès");
    } catch (error: any) {
      if (error.response) {
        console.error("Erreur lors de la suppression de la commande:", error.response.data?.message);
        return ServiceResult.failed();
      }
      console.error("Erreur de connexion:", error);
      return ServiceResult.failed();
    }
  }

  static async updateOrder(orderId: number, order: IOrder): Promise<ServiceResult<IOrderResponse>> {
    try {
      const response = await axios.put(`${ApiService.baseURL}/orders/update/${orderId}`, order, {
        headers: this.getAuthHeaders(),
      });
      return ServiceResult.success(response.data);
    } catch (error: any) {
      if (error.response) {
        console.error("Erreur lors de la modification de la commande:", error.response.data?.message);
        return ServiceResult.failed();
      }
      console.error("Erreur de connexion:", error);
      return ServiceResult.failed();
    }
  }

  static async getUniqueSuppliers(): Promise<ServiceResult<number>> {
    try {
      const response = await axios.get(`${ApiService.baseURL}/supplier/count`, {
        headers: this.getAuthHeaders(),
      });
      return ServiceResult.success(response.data.count || 0);
    } catch (error: any) {
      if (error.response) {
        console.error("Erreur lors du comptage des fournisseurs:", error.response.data?.message);
        return ServiceResult.failed();
      }
      console.error("Erreur de connexion:", error);
      return ServiceResult.failed();
    }
  }
} 