"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Truck, Trash2, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ErrorService } from "@/services/error.service"
import SupplierService from "@/services/supplier.service"
import { ServiceErrorCode } from "@/services/service.result"
import { ISupplier } from "@/models/supplier.model"

interface DeleteSupplierDialogProps {
  isOpen: boolean
  onClose: () => void
  supplier: ISupplier | null
  onSupplierDeleted: () => void
}

export function DeleteSupplierDialog({ isOpen, onClose, supplier, onSupplierDeleted }: DeleteSupplierDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!supplier?.id) return

    setIsLoading(true)
    try {
      const result = await SupplierService.deleteSupplier(supplier.id)

      if (result && result.errorCode === ServiceErrorCode.success) {
        ErrorService.successMessage("Fournisseur supprimé", "Le fournisseur a été supprimé avec succès")
        onSupplierDeleted()
        onClose()
      } else if (result?.errorCode === ServiceErrorCode.notFound) {
        ErrorService.errorMessage("Fournisseur non trouvé", "Ce fournisseur n'existe plus")
      } else {
        ErrorService.errorMessage("Erreur", "Impossible de supprimer le fournisseur")
      }
    } catch (error) {
      ErrorService.errorMessage("Erreur", "Une erreur est survenue lors de la suppression du fournisseur")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  if (!supplier) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md mx-4 bg-gray-800 rounded-lg shadow-2xl border border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Supprimer le fournisseur</h2>
                  <p className="text-sm text-gray-400">Cette action est irréversible</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-3 p-4 bg-gray-700/50 rounded-lg">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {supplier.supplierName}
                  </p>
                  <p className="text-sm text-gray-400">ID: {supplier.id}</p>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-gray-300">
                  Êtes-vous sûr de vouloir supprimer ce fournisseur ?
                </p>
                <p className="text-sm text-gray-400">
                  Cette action ne peut pas être annulée.
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10"
                >
                  Annuler
                </Button>
                
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-red-500/25"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Suppression...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Trash2 className="w-4 h-4" />
                      <span>Supprimer</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 