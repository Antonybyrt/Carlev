"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Car, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorService } from "@/services/error.service"
import CarModelService from "@/services/car-model.service"
import { ServiceErrorCode } from "@/services/service.result"
import { ICarBrand } from "@/models/car-brand.model"

interface CreateCarModelDialogProps {
  isOpen: boolean
  onClose: () => void
  brandId: number
  brandName: string
  onCarModelCreated: () => void
}

export function CreateCarModelDialog({ isOpen, onClose, brandId, brandName, onCarModelCreated }: CreateCarModelDialogProps) {
  const [modelName, setModelName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!modelName.trim()) {
      ErrorService.errorMessage("Champ manquant", "Veuillez saisir le nom du modèle")
      return
    }

    setIsLoading(true)
    try {
      const result = await CarModelService.createCarModel(modelName.trim(), brandId)

      if (result && result.errorCode === ServiceErrorCode.success) {
        ErrorService.successMessage("Modèle créé", "Le modèle a été créé avec succès")
        setModelName("")
        onCarModelCreated()
        onClose()
      } else {
        ErrorService.errorMessage("Erreur", "Impossible de créer le modèle")
      }
    } catch (error) {
      ErrorService.errorMessage("Erreur", "Une erreur est survenue lors de la création du modèle")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setModelName("")
      onClose()
    }
  }

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
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Créer un modèle</h2>
                  <p className="text-sm text-gray-400">Ajouter un nouveau modèle pour {brandName}</p>
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
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="modelName" className="text-gray-300">
                    Nom du modèle
                  </Label>
                  <Input
                    id="modelName"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="Ex: Clio, Mégane, Captur..."
                    className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Marque :</span> {brandName}
                  </p>
                </div>
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
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-blue-500/25"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Création...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Créer le modèle</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 