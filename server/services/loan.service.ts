import { Loan } from '../models';
import { ServiceResult } from './service.result';

export class LoanService {

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

    static async createLoan(loanerCarId: number, orNumber: number, customerId: number, startDate: Date, endDate: Date, notes: string): Promise<ServiceResult<Loan>> {
        try {
            const newLoan = await Loan.create({
                loanerCarId,
                orNumber,
                customerId,
                startDate,
                endDate,
                notes
            });
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
            return ServiceResult.failed();
        }
    }
} 