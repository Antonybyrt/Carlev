import { LoanerCar } from '../models';
import { ServiceResult } from './service.result';

export class LoanerCarService {

    static async getAllLoanerCars(): Promise<ServiceResult<LoanerCar[]>> {
        try {
            const loanerCars = await LoanerCar.findAll({
                include: [
                    { association: 'brand' },
                    { association: 'model' },
                    { association: 'registration' }
                ]
            });
            return ServiceResult.success(loanerCars);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async getLoanerCarById(id: number): Promise<ServiceResult<LoanerCar>> {
        try {
            const loanerCar = await LoanerCar.findByPk(id, {
                include: [
                    { association: 'brand' },
                    { association: 'model' },
                    { association: 'registration' }
                ]
            });
            if (!loanerCar) {
                return ServiceResult.notFound();
            }
            return ServiceResult.success(loanerCar);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async createLoanerCar(carBrandId: number, carModelId: number, registrationId: number, status: string): Promise<ServiceResult<LoanerCar>> {
        try {
            const newLoanerCar = await LoanerCar.create({
                carBrandId,
                carModelId,
                registrationId,
                status
            });
            return ServiceResult.success(newLoanerCar);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async deleteLoanerCar(id: number): Promise<ServiceResult<boolean>> {
        try {
            const loanerCar = await LoanerCar.findByPk(id);
            if (!loanerCar) {
                return ServiceResult.notFound();
            }
            await loanerCar.destroy();
            return ServiceResult.success(true);
        } catch (error) {
            return ServiceResult.failed();
        }
    }
} 