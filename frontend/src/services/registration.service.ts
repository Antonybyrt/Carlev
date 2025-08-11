import axios from "axios";
import { ApiService } from "./api.service";
import { ServiceResult } from "./service.result";
import { IRegistration } from "@/models/registration.model";

export default class RegistrationService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("Token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static async getAllRegistrations(): Promise<ServiceResult<IRegistration[]>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/registration/`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      return ServiceResult.failed();
    }
  }

  static async createRegistration(registrationName: string): Promise<ServiceResult<IRegistration>> {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/registration/`,
        { registration_name: registrationName },
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 201) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error creating registration:", error);
      return ServiceResult.failed();
    }
  }

  static async deleteRegistration(registrationId: number): Promise<ServiceResult<string>> {
    try {
      const response = await axios.delete(
        `${ApiService.baseURL}/registration/${registrationId}`,
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
      console.error("Error deleting registration:", error);
      return ServiceResult.failed();
    }
  }

  static async getRegistrationById(registrationId: number): Promise<ServiceResult<IRegistration>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/registration/${registrationId}`,
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
      console.error("Error fetching registration by ID:", error);
      return ServiceResult.failed();
    }
  }
} 