import axios from "axios";
import { ApiService } from "./api.service";
import { ServiceResult } from "./service.result";
import { ISupplier } from "@/models/supplier.model";

export default class SupplierService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("Token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static async getAllSuppliers(): Promise<ServiceResult<ISupplier[]>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/supplier/`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      return ServiceResult.failed();
    }
  }

  static async createSupplier(supplierName: string): Promise<ServiceResult<ISupplier>> {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/supplier/`,
        { supplier_name: supplierName },
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 201) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error creating supplier:", error);
      return ServiceResult.failed();
    }
  }

  static async deleteSupplier(supplierId: number): Promise<ServiceResult<string>> {
    try {
      const response = await axios.delete(
        `${ApiService.baseURL}/supplier/${supplierId}`,
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
      console.error("Error deleting supplier:", error);
      return ServiceResult.failed();
    }
  }

  static async getSupplierCount(): Promise<ServiceResult<number>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/supplier/count`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        return ServiceResult.success(response.data.count);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error fetching supplier count:", error);
      return ServiceResult.failed();
    }
  }
} 