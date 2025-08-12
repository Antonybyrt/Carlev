import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Package, X, Trash2 } from "lucide-react";
import { ErrorService } from "@/services/error.service";
import ItemService from "@/services/item.service";
import { ServiceErrorCode } from "@/services/service.result";
import { IItem } from "@/models/item.model";

interface DeleteItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onItemDeleted: () => void;
  item: IItem | null;
}

export function DeleteItemDialog({ isOpen, onClose, onItemDeleted, item }: DeleteItemDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!item?.id) {
      ErrorService.errorMessage("Erreur", "Pièce non trouvée");
      return;
    }

    setIsLoading(true);
    try {
      const result = await ItemService.deleteItem(item.id);

      if (result && result.errorCode === ServiceErrorCode.success) {
        ErrorService.successMessage("Succès", "Pièce supprimée avec succès");
        onItemDeleted();
        handleClose();
      } else {
        ErrorService.errorMessage("Erreur", "Impossible de supprimer la pièce");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la pièce:", error);
      ErrorService.errorMessage("Erreur", "Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsLoading(false);
    onClose();
  };

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Trash2 className="w-5 h-5 text-red-400" />
                <span>Supprimer la pièce</span>
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-gray-300">
                <p>Êtes-vous sûr de vouloir supprimer cette pièce ?</p>
                <p className="text-sm text-gray-400 mt-2">Cette action est irréversible.</p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-white">{item.itemName}</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 bg-transparent hover:bg-gray-700"
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLoading ? "Suppression..." : "Supprimer"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 