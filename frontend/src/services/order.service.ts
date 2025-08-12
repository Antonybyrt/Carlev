import axios from "axios";
import { ApiService } from "./api.service";
import { ServiceResult } from "./service.result";
import { IOrder, IOrderResponse } from "@/models/order.model";

export default class OrderService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("Token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static async createOrder(order: IOrder): Promise<ServiceResult<IOrderResponse>> {
    try {
      const response = await axios.post(`${ApiService.baseURL}/order`, order, {
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
} 