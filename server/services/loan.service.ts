import { ServiceResult } from "./service.result";
import { Loan } from "../models/loan.model";
import sequelize from "../config/database.config";
import { Op } from "sequelize";

export class LoanService {

    static async checkDateOverlap(loanerCarId: number, startDate: Date, endDate: Date, excludeLoanId?: number): Promise<boolean> {
        try {
            const whereClause: any = {
                loanerCarId,
                id: { [Op.ne]: excludeLoanId || 0 }
            };

            const overlappingLoans = await Loan.findAll({
                where: {
                    ...whereClause,
                    [Op.or]: [
                        {
                            startDate: { [Op.lte]: endDate },
                            endDate: { [Op.gte]: startDate }
                        }
                    ]
                }
            });

            return overlappingLoans.length > 0;
        } catch (error) {
            console.error('Erreur lors de la vérification des chevauchements:', error);
            return false;
        }
    }

    static async getAllLoans(): Promise<ServiceResult<Loan[]>> {
        try {
            const loans = await Loan.findAll({
                include: [
                    { association: 'loanerCar' },
                    { association: 'customer' }
                ]
            });
            return ServiceResult.success(loans);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async getLoanById(id: number): Promise<ServiceResult<Loan>> {
        try {
            const loan = await Loan.findByPk(id, {
                include: [
                    { association: 'loanerCar' },
                    { association: 'customer' }
                ]
            });
            if (!loan) {
                return ServiceResult.notFound();
            }
            return ServiceResult.success(loan);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async createLoan(loanData: { loanerCarId: number; orNumber: number; customerId: number; startDate: Date; endDate: Date; notes?: string }): Promise<ServiceResult<Loan>> {
        try {
            const hasOverlap = await this.checkDateOverlap(
                loanData.loanerCarId,
                loanData.startDate,
                loanData.endDate
            );

            if (hasOverlap) {
                return ServiceResult.conflict();
            }

            const newLoan = await Loan.create(loanData);
            return ServiceResult.success(newLoan);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async deleteLoan(id: number): Promise<ServiceResult<boolean>> {
        try {
            const loan = await Loan.findByPk(id);
            if (!loan) {
                return ServiceResult.notFound();
            }

            await loan.destroy();
            return ServiceResult.success(true);
        } catch (error) {
            console.error('Erreur lors de la suppression du prêt:', error);
            return ServiceResult.failed();
        }
    }

    static async updateLoan(id: number, updateData: Partial<Loan>): Promise<ServiceResult<Loan>> {
        try {
            const loan = await Loan.findByPk(id);
            if (!loan) {
                return ServiceResult.notFound();
            }

            if (updateData.startDate || updateData.endDate) {
                const startDate = updateData.startDate || loan.startDate;
                const endDate = updateData.endDate || loan.endDate;
                
                const hasOverlap = await this.checkDateOverlap(
                    loan.loanerCarId,
                    startDate,
                    endDate,
                    id
                );

                if (hasOverlap) {
                    return ServiceResult.conflict();
                }
            }

            await loan.update(updateData);
            
            const updatedLoan = await Loan.findByPk(id, {
                include: [
                    { model: sequelize.models.LoanerCar, as: 'loanerCar' },
                    { model: sequelize.models.Customer, as: 'customer' }
                ]
            });

            return ServiceResult.success(updatedLoan!);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du prêt:', error);
            return ServiceResult.failed();
        }
    }
} 