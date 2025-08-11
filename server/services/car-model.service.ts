import { CarModel, CarBrand } from '../models';
import { ServiceResult } from './service.result';

export class CarModelService {

    static async getCarModelsByBrand(brandId: number): Promise<ServiceResult<CarModel[]>> {
        try {
            const carModels = await CarModel.findAll({
                where: { brandId },
                attributes: ['id', 'modelName']
            });
            return ServiceResult.success(carModels);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async createCarModel(modelName: string, brandId: number): Promise<ServiceResult<CarModel>> {
        try {
            const carBrandExists = await CarBrand.findByPk(brandId);
            if (!carBrandExists) {
                return ServiceResult.notFound();
            }

            const newCarModel = await CarModel.create({
                modelName,
                brandId
            });
            return ServiceResult.success(newCarModel);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async deleteCarModel(id: number): Promise<ServiceResult<boolean>> {
        try {
            const carModel = await CarModel.findByPk(id);
            if (!carModel) {
                return ServiceResult.notFound();
            }
            await carModel.destroy();
            return ServiceResult.success(true);
        } catch (error) {
            return ServiceResult.failed();
        }
    }
} 