import { Supplier } from '../models';
import { ServiceResult } from './service.result';

export class SupplierService {

    static async getAllSuppliers(): Promise<ServiceResult<Supplier[]>> {
        try {
            const suppliers = await Supplier.findAll();
            return ServiceResult.success(suppliers);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async createSupplier(supplierName: string): Promise<ServiceResult<Supplier>> {
        try {
            const newSupplier = await Supplier.create({
                supplierName
            });
            return ServiceResult.success(newSupplier);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async deleteSupplier(id: number): Promise<ServiceResult<boolean>> {
        try {
            const supplier = await Supplier.findByPk(id);
            if (!supplier) {
                return ServiceResult.notFound();
            }
            await supplier.destroy();
            return ServiceResult.success(true);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async getSupplierCount(): Promise<ServiceResult<number>> {
        try {
            const count = await Supplier.count();
            return ServiceResult.success(count);
        } catch (error) {
            return ServiceResult.failed();
        }
    }
} 