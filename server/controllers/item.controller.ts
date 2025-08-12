import express, { Request, Response, Router } from 'express';
import { ItemService } from '../services';
import { ServiceErrorCode } from '../services/service.result';

export class ItemController {

    async getAllItems(req: Request, res: Response): Promise<void> {
        try {
            const result = await ItemService.getAllItems();
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error fetching items:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async createItem(req: Request, res: Response): Promise<void> {
        try {
            const { itemName } = req.body;
            if (!itemName) {
                res.status(400).json({ error: "itemName is required" });
                return;
            }

            const result = await ItemService.createItem(itemName);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(201).json(result.result);
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error creating item:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async deleteItem(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const numericId = parseInt(id);

            if (isNaN(numericId)) {
                res.status(400).json({ error: "Invalid ID" });
                return;
            }

            const result = await ItemService.deleteItem(numericId);
            if (result.errorCode === ServiceErrorCode.success) {
                res.status(200).json({ message: "Item deleted successfully!" });
            } else if (result.errorCode === ServiceErrorCode.notFound) {
                res.status(404).json({ error: "Item not found" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        } catch (error) {
            console.error("Error deleting item:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', this.getAllItems.bind(this));
        router.post('/', this.createItem.bind(this));
        router.delete('/:id', this.deleteItem.bind(this));
        return router;
    }
} 