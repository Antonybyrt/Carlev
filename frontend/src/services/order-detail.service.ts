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

  static async getOrderDetails(): Promise<ServiceResult<IOrderDetail[]>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/order_detail/`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      return ServiceResult.failed();
    }
  }

  static async createOrderDetail(orderDetail: IOrderDetail): Promise<ServiceResult<IOrderDetail>> {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/order_detail/`,
        orderDetail,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 201) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error creating order detail:", error);
      return ServiceResult.failed();
    }
  }

  static async deleteOrderDetail(orderDetailId: number): Promise<ServiceResult<string>> {
    try {
      const response = await axios.delete(
        `${ApiService.baseURL}/order_detail/${orderDetailId}`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        return ServiceResult.success(response.data.message);
      } else if (response.status === 404) {
        return ServiceResult.notFound();
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error deleting order detail:", error);
      return ServiceResult.failed();
    }
  }
} 