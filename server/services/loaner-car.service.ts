import { LoanerCar } from '../models';
import { ServiceResult } from './service.result';
import sequelize from '../config/database.config';

export class LoanerCarService {
  static async getAllLoanerCars(): Promise<ServiceResult<LoanerCar[]>> {
    try {
      const loanerCars = await LoanerCar.findAll({
        where: { isDeleted: false },
        include: [
          { model: sequelize.models.CarBrand, as: 'brand' },
          { model: sequelize.models.CarModel, as: 'model' },
          { model: sequelize.models.Registration, as: 'registration' }
        ]
      });
      return ServiceResult.success(loanerCars);
    } catch (error) {
      console.error('Erreur lors de la récupération des voitures de prêt:', error);
      return ServiceResult.failed();
    }
  }

  static async getLoanerCarById(id: number): Promise<ServiceResult<LoanerCar>> {
    try {
      const loanerCar = await LoanerCar.findOne({
        where: { id, isDeleted: false },
        include: [
          { model: sequelize.models.CarBrand, as: 'brand' },
          { model: sequelize.models.CarModel, as: 'model' },
          { model: sequelize.models.Registration, as: 'registration' }
        ]
      });
      
      if (!loanerCar) {
        return ServiceResult.notFound();
      }
      
      return ServiceResult.success(loanerCar);
    } catch (error) {
      console.error('Erreur lors de la récupération de la voiture de prêt:', error);
      return ServiceResult.failed();
    }
  }

  static async createLoanerCar(carBrandId: number, carModelId: number, registrationId: number, status: string): Promise<ServiceResult<LoanerCar>> {
    try {
      const newLoanerCar = await LoanerCar.create({
        carBrandId,
        carModelId,
        registrationId,
        status,
        isDeleted: false
      });
      
      const createdLoanerCar = await LoanerCar.findOne({
        where: { id: newLoanerCar.id, isDeleted: false },
        include: [
          { model: sequelize.models.CarBrand, as: 'brand' },
          { model: sequelize.models.CarModel, as: 'model' },
          { model: sequelize.models.Registration, as: 'registration' }
        ]
      });
      
      return ServiceResult.success(createdLoanerCar!);
    } catch (error) {
      console.error('Erreur lors de la création de la voiture de prêt:', error);
      return ServiceResult.failed();
    }
  }

  static async deleteLoanerCar(id: number): Promise<ServiceResult<boolean>> {
    try {
      const loanerCar = await LoanerCar.findByPk(id);
      if (!loanerCar) {
        return ServiceResult.notFound();
      }
      
      await loanerCar.update({ isDeleted: true });
      return ServiceResult.success(true);
    } catch (error) {
      console.error('Erreur lors de la suppression de la voiture de prêt:', error);
      return ServiceResult.failed();
    }
  }

  static async updateLoanerCar(id: number, updateData: Partial<LoanerCar>): Promise<ServiceResult<LoanerCar>> {
    try {
      const loanerCar = await LoanerCar.findOne({
        where: { id, isDeleted: false },
        include: [
          { model: sequelize.models.CarBrand, as: 'brand' },
          { model: sequelize.models.CarModel, as: 'model' },
          { model: sequelize.models.Registration, as: 'registration' }
        ]
      });
      
      if (!loanerCar) {
        return ServiceResult.notFound();
      }
      
      await loanerCar.update(updateData);
      
      const updatedLoanerCar = await LoanerCar.findOne({
        where: { id, isDeleted: false },
        include: [
          { model: sequelize.models.CarBrand, as: 'brand' },
          { model: sequelize.models.CarModel, as: 'model' },
          { model: sequelize.models.Registration, as: 'registration' }
        ]
      });
      
      return ServiceResult.success(updatedLoanerCar!);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la voiture de prêt:', error);
      return ServiceResult.failed();
    }
  }
} 