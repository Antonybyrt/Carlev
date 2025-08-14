import axios from "axios";
import { ApiService } from "./api.service";
import { ServiceResult } from "./service.result";
import { ILoanerCar, ILoanerCarWithAssociations } from "@/models/loaner-car.model";

export default class LoanerCarService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("Token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static async getAllLoanerCars(): Promise<ServiceResult<ILoanerCarWithAssociations[]>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/loaner_car/`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error fetching loaner cars:", error);
      return ServiceResult.failed();
    }
  }

  static async getLoanerCarById(id: number): Promise<ServiceResult<ILoanerCarWithAssociations>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/loaner_car/${id}`,
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
      console.error("Error fetching loaner car:", error);
      return ServiceResult.failed();
    }
  }

  static async createLoanerCar(loanerCar: Omit<ILoanerCar, 'id'>): Promise<ServiceResult<ILoanerCar>> {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/loaner_car/`,
        loanerCar,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 201) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error creating loaner car:", error);
      return ServiceResult.failed();
    }
  }

  static async deleteLoanerCar(id: number): Promise<ServiceResult<boolean>> {
    try {
      const response = await axios.patch(
        `${ApiService.baseURL}/loaner_car/${id}`,
        {},
        { headers: this.getAuthHeaders() }
      );

      if (response.status === 200) {
        return ServiceResult.success(true);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la voiture de prêt:', error);
      return ServiceResult.failed();
    }
  }

  static async updateLoanerCar(id: number, updateData: Partial<ILoanerCar>): Promise<ServiceResult<ILoanerCarWithAssociations>> {
    try {
      const response = await axios.put(
        `${ApiService.baseURL}/loaner_car/${id}`,
        updateData,
        { headers: this.getAuthHeaders() }
      );

      if (response.status === 200) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la voiture de prêt:', error);
      return ServiceResult.failed();
    }
  }
} 