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
      const response = await axios.get(`${ApiService.baseURL}/item`, {
        headers: this.getAuthHeaders(),
      });
      return ServiceResult.success(response.data);
    } catch (error: any) {
      if (error.response) {
        console.error("Erreur lors de la récupération des pièces:", error.response.data?.message);
        return ServiceResult.failed();
      }
      console.error("Erreur de connexion:", error);
      return ServiceResult.failed();
    }
  }

  static async createItem(itemName: string): Promise<ServiceResult<IItem>> {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/item`,
        { itemName },
        { headers: this.getAuthHeaders() }
      );
      return ServiceResult.success(response.data);
    } catch (error: any) {
      if (error.response) {
        console.error("Erreur lors de la création de la pièce:", error.response.data?.message);
        return ServiceResult.failed();
      }
      console.error("Erreur de connexion:", error);
      return ServiceResult.failed();
    }
  }

  static async deleteItem(itemId: number): Promise<ServiceResult<string>> {
    try {
      const response = await axios.delete(`${ApiService.baseURL}/item/${itemId}`, {
        headers: this.getAuthHeaders(),
      });
      return ServiceResult.success(response.data?.message || "Pièce supprimée avec succès");
    } catch (error: any) {
      if (error.response) {
        console.error("Erreur lors de la suppression de la pièce:", error.response.data?.message);
        return ServiceResult.failed();
      }
      console.error("Erreur de connexion:", error);
      return ServiceResult.failed();
    }
  }

  static async getItemCount(): Promise<ServiceResult<number>> {
    try {
      const response = await axios.get(`${ApiService.baseURL}/item/count`, {
        headers: this.getAuthHeaders(),
      });
      return ServiceResult.success(response.data.count || 0);
    } catch (error: any) {
      if (error.response) {
        console.error("Erreur lors du comptage des pièces:", error.response.data?.message);
        return ServiceResult.failed();
      }
      console.error("Erreur de connexion:", error);
      return ServiceResult.failed();
    }
  }
} 