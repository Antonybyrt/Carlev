import axios from "axios";
import { ApiService } from "./api.service";
import { ServiceResult } from "./service.result";
import { ICustomer } from "@/models/customer.model";

export default class CustomerService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("Token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static async getCustomersByLogin(loginId: number): Promise<ServiceResult<ICustomer[]>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/customer/customer/${loginId}`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error fetching customers by login:", error);
      return ServiceResult.failed();
    }
  }

  static async getAllCustomers(): Promise<ServiceResult<ICustomer[]>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/customer/`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error fetching all customers:", error);
      return ServiceResult.failed();
    }
  }

  static async createCustomer(
    firstName: string, 
    lastName: string, 
    loginId: number
  ): Promise<ServiceResult<ICustomer>> {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/customer/${loginId}`,
        {
          first_name: firstName,
          last_name: lastName
        },
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 201) {
        return ServiceResult.success(response.data);
      } else if (response.status === 404) {
        return ServiceResult.notFound();
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      return ServiceResult.failed();
    }
  }

  static async deleteCustomer(customerId: number): Promise<ServiceResult<string>> {
    try {
      const response = await axios.delete(
        `${ApiService.baseURL}/customer/${customerId}`,
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
      console.error("Error deleting customer:", error);
      return ServiceResult.failed();
    }
  }

  static async getCustomerCount(): Promise<ServiceResult<number>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/customer/count`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        return ServiceResult.success(response.data.count);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error fetching customer count:", error);
      return ServiceResult.failed();
    }
  }
} 