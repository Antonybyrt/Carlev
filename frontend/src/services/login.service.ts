import axios from "axios";
import { ApiService } from "./api.service";
import { ServiceResult } from "./service.result";
import { ILogin } from "@/models/login.model";

export default class LoginService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("Token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static async getAllLogins(): Promise<ServiceResult<ILogin[]>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/login/`,
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
}