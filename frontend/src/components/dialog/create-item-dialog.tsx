import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, X } from "lucide-react";
import { ErrorService } from "@/services/error.service";
import ItemService from "@/services/item.service";
import { ServiceErrorCode } from "@/services/service.result";

interface CreateItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onItemCreated: () => void;
}

export function CreateItemDialog({ isOpen, onClose, onItemCreated }: CreateItemDialogProps) {
  const [itemName, setItemName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemName.trim()) {
      ErrorService.errorMessage("Champ requis", "Le nom de la pièce est obligatoire");
      return;
    }

    setIsLoading(true);
    try {
      const result = await ItemService.createItem(itemName.trim());

      if (result && result.errorCode === ServiceErrorCode.success) {
        ErrorService.successMessage("Succès", "Pièce créée avec succès");
        onItemCreated();
        handleClose();
      } else {
        ErrorService.errorMessage("Erreur", "Impossible de créer la pièce");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la pièce:", error);
      ErrorService.errorMessage("Erreur", "Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setItemName("");
    setIsLoading(false);
    onClose();
  };

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
                <Package className="w-5 h-5 text-blue-400" />
                <span>Créer une nouvelle pièce</span>
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

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemName" className="text-gray-300">
                  Nom de la pièce *
                </Label>
                <Input
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Ex: Frein avant, Phare, etc."
                  className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                  required
                />
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
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? "Création..." : "Créer la pièce"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 