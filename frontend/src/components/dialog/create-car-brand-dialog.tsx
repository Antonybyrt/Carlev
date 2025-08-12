"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Car, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorService } from "@/services/error.service"
import CarBrandService from "@/services/car-brand.service"
import { ServiceErrorCode } from "@/services/service.result"

interface CreateCarBrandDialogProps {
  isOpen: boolean
  onClose: () => void
  onCarBrandCreated: () => void
}

export function CreateCarBrandDialog({ isOpen, onClose, onCarBrandCreated }: CreateCarBrandDialogProps) {
  const [brandName, setBrandName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!brandName.trim()) {
      ErrorService.errorMessage("Champ manquant", "Veuillez saisir le nom de la marque")
      return
    }

    setIsLoading(true)
    try {
      const result = await CarBrandService.createCarBrand(brandName.trim())

      if (result && result.errorCode === ServiceErrorCode.success) {
        ErrorService.successMessage("Marque créée", "La marque a été créée avec succès")
        setBrandName("")
        onCarBrandCreated()
        onClose()
      } else {
        ErrorService.errorMessage("Erreur", "Impossible de créer la marque")
      }
    } catch (error) {
      ErrorService.errorMessage("Erreur", "Une erreur est survenue lors de la création de la marque")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setBrandName("")
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
                  <h2 className="text-xl font-semibold text-white">Créer une marque</h2>
                  <p className="text-sm text-gray-400">Ajouter une nouvelle marque de véhicule</p>
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
                  <Label htmlFor="brandName" className="text-gray-300">
                    Nom de la marque
                  </Label>
                  <Input
                    id="brandName"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Ex: Renault, BMW, Mercedes..."
                    className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                    required
                    disabled={isLoading}
                  />
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
                      <span>Créer la marque</span>
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