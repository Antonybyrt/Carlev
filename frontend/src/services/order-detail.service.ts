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
} 