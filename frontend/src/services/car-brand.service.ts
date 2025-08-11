import axios from "axios";
import { ApiService } from "./api.service";
import { ServiceResult } from "./service.result";
import { ICarBrand } from "@/models/car-brand.model";

export default class CarBrandService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("Token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  static async getAllCarBrands(): Promise<ServiceResult<ICarBrand[]>> {
    try {
      const response = await axios.get(
        `${ApiService.baseURL}/car_brand/`,
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 200) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error fetching car brands:", error);
      return ServiceResult.failed();
    }
  }

  static async createCarBrand(brandName: string): Promise<ServiceResult<ICarBrand>> {
    try {
      const response = await axios.post(
        `${ApiService.baseURL}/car_brand/`,
        { brandName },
        { headers: this.getAuthHeaders() }
      );
      
      if (response.status === 201) {
        return ServiceResult.success(response.data);
      } else {
        return ServiceResult.failed();
      }
    } catch (error) {
      console.error("Error creating car brand:", error);
      return ServiceResult.failed();
    }
  }

  static async deleteCarBrand(brandId: number): Promise<ServiceResult<string>> {
    try {
      const response = await axios.delete(
        `${ApiService.baseURL}/car_brand/${brandId}`,
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
      console.error("Error deleting car brand:", error);
      return ServiceResult.failed();
    }
  }
} 