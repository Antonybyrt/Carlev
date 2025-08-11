import axios from "axios";
import { ApiService } from "./api.service";
import { ServiceResult } from "./service.result";
import { ICarModel } from "@/models/car-model.model";

export default class CarModelService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("Token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static async getCarModelsByBrand(brandId: number): Promise<ServiceResult<ICarModel[]>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/car_model/models/${brandId}`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error fetching car models by brand:", error);
      return ServiceResult.failed();
    }
  }

  static async createCarModel(
    modelName: string, 
    brandId: number
  ): Promise<ServiceResult<ICarModel>> {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/car_model/${brandId}`,
        { modelName },
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
      console.error("Error creating car model:", error);
      return ServiceResult.failed();
    }
  }

  static async deleteCarModel(modelId: number): Promise<ServiceResult<string>> {
    try {
      const response = await axios.delete(
        `${ApiService.baseURL}/car_model/${modelId}`,
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
      console.error("Error deleting car model:", error);
      return ServiceResult.failed();
    }
  }
} 