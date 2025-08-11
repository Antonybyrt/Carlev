import { Item } from '../models';
import { ServiceResult } from './service.result';

export class ItemService {

    static async getAllItems(): Promise<ServiceResult<Item[]>> {
        try {
            const items = await Item.findAll();
            return ServiceResult.success(items);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async createItem(itemName: string): Promise<ServiceResult<Item>> {
        try {
            const newItem = await Item.create({
                itemName
            });
            return ServiceResult.success(newItem);
        } catch (error) {
            return ServiceResult.failed();
        }
    }

    static async deleteItem(id: number): Promise<ServiceResult<boolean>> {
        try {
            const item = await Item.findByPk(id);
            if (!item) {
                return ServiceResult.notFound();
            }
            await item.destroy();
            return ServiceResult.success(true);
        } catch (error) {
            return ServiceResult.failed();
        }
    }
} 