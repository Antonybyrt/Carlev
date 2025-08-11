import { Registration } from '../models';
import { ServiceResult } from './service.result';

export class RegistrationService {

    static async getAllRegistrations(): Promise<ServiceResult<Registration[]>> {
        try {
            const registrations = await Registration.findAll();
            return ServiceResult.success(registrations);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async createRegistration(registrationName: string): Promise<ServiceResult<Registration>> {
        try {
            const newRegistration = await Registration.create({
                registrationName
            });
            return ServiceResult.success(newRegistration);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async deleteRegistration(id: number): Promise<ServiceResult<boolean>> {
        try {
            const registration = await Registration.findByPk(id);
            if (!registration) {
                return ServiceResult.notFound();
            }
            await registration.destroy();
            return ServiceResult.success(true);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async getRegistrationCount(): Promise<ServiceResult<number>> {
        try {
            const count = await Registration.count();
            return ServiceResult.success(count);
        } catch (error) {
            return ServiceResult.failed();
        }
    }
} 