import axios from "axios";
import { ApiService } from "./api.service";
import { ServiceResult } from "./service.result";
import { IItem } from "@/models/item.model";

export default class ItemService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("Token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static async getAllItems(): Promise<ServiceResult<IItem[]>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/item/`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      return ServiceResult.failed();
    }
  }

  static async createItem(itemName: string): Promise<ServiceResult<IItem>> {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/item/`,
        { item_name: itemName },
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 201) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error creating item:", error);
      return ServiceResult.failed();
    }
  }

  static async deleteItem(itemId: number): Promise<ServiceResult<string>> {
    try {
      const response = await axios.delete(
        `${ApiService.baseURL}/item/${itemId}`,
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
      console.error("Error deleting item:", error);
      return ServiceResult.failed();
    }
  }
} 