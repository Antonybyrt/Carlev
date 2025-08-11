import { Customer, Login } from '../models';
import { ServiceResult } from './service.result';

export class CustomerService {

    static async getCustomersByLogin(loginId: number): Promise<ServiceResult<Customer[]>> {
        try {
            const customers = await Customer.findAll({
                where: { loginId }
            });
            return ServiceResult.success(customers);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async getAllCustomers(): Promise<ServiceResult<Customer[]>> {
        try {
            const customers = await Customer.findAll();
            return ServiceResult.success(customers);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async createCustomer(firstName: string, lastName: string, loginId: number): Promise<ServiceResult<Customer>> {
        try {
            const loginExists = await Login.findByPk(loginId);
            if (!loginExists) {
                return ServiceResult.notFound();
            }

            const newCustomer = await Customer.create({
                firstName,
                lastName,
                loginId
            });
            return ServiceResult.success(newCustomer);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async deleteCustomer(id: number): Promise<ServiceResult<boolean>> {
        try {
            const customer = await Customer.findByPk(id);
            if (!customer) {
                return ServiceResult.notFound();
            }
            await customer.destroy();
            return ServiceResult.success(true);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async getCustomerCount(): Promise<ServiceResult<number>> {
        try {
            const count = await Customer.count();
            return ServiceResult.success(count);
        } catch (error) {
            return ServiceResult.failed();
        }
    }
} 