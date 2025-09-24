import axios from "axios";
import { ApiService } from "./api.service";
import { ServiceResult } from "./service.result";
import { IOrderDetail } from "@/models/order-detail.model";

export default class OrderDetailService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("Token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static async createOrderDetail(orderDetail: IOrderDetail): Promise<ServiceResult<IOrderDetail>> {
    try {
      const response = await axios.post(`${ApiService.baseURL}/order_detail`, orderDetail, {
        headers: this.getAuthHeaders(),
      });
      return ServiceResult.success(response.data);
    } catch (error: any) {
      if (error.response) {
        console.error("Erreur lors de la création du détail de commande:", error.response.data?.message);
        return ServiceResult.failed();
      }
      console.error("Erreur de connexion:", error);
      return ServiceResult.failed();
    }
  }

  static async deleteOrderDetailsByOrderId(orderId: number): Promise<ServiceResult<string>> {
    try {
      const response = await axios.delete(`${ApiService.baseURL}/order_detail/order/${orderId}`, {
        headers: this.getAuthHeaders(),
      });
      return ServiceResult.success(response.data?.message || "Détails de commande supprimés avec succès");
    } catch (error: any) {
      if (error.response) {
        console.error("Erreur lors de la suppression des détails de commande:", error.response.data?.message);
        return ServiceResult.failed();
      }
      console.error("Erreur de connexion:", error);
      return ServiceResult.failed();
    }
  }
} 