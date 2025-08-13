import axios from "axios";
import { ApiService } from "./api.service";
import { ServiceResult } from "./service.result";
import { ILoan, ILoanWithAssociations } from "@/models/loan.model";

export default class LoanService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("Token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static async getAllLoans(): Promise<ServiceResult<ILoanWithAssociations[]>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/loan/`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
      return ServiceResult.failed();
    }
  }

  static async getLoanById(id: number): Promise<ServiceResult<ILoanWithAssociations>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/loan/${id}`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        return ServiceResult.success(response.data);
      } else if (response.status === 404) {
        return ServiceResult.notFound();
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error fetching loan:", error);
      return ServiceResult.failed();
    }
  }

  static async createLoan(loan: Omit<ILoan, 'id'>): Promise<ServiceResult<ILoan>> {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/loan/`,
        loan,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 201) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error creating loan:", error);
      return ServiceResult.failed();
    }
  }

  static async deleteLoan(id: number): Promise<ServiceResult<string>> {
    try {
      const response = await axios.delete(
        `${ApiService.baseURL}/loan/${id}`,
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
      console.error("Error deleting loan:", error);
      return ServiceResult.failed();
    }
  }
} 