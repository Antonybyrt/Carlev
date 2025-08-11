import { CarBrand } from '../models';
import { ServiceResult } from './service.result';

export class CarBrandService {

    static async getAllCarBrands(): Promise<ServiceResult<CarBrand[]>> {
        try {
            const carBrands = await CarBrand.findAll();
            return ServiceResult.success(carBrands);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async createCarBrand(brandName: string): Promise<ServiceResult<CarBrand>> {
        try {
            const newCarBrand = await CarBrand.create({
                brandName
            });
            return ServiceResult.success(newCarBrand);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async deleteCarBrand(id: number): Promise<ServiceResult<boolean>> {
        try {
            const carBrand = await CarBrand.findByPk(id);
            if (!carBrand) {
                return ServiceResult.notFound();
            }
            await carBrand.destroy();
            return ServiceResult.success(true);
        } catch (error) {
            return ServiceResult.failed();
        }
    }
} 