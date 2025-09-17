"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ILoanWithAssociations } from "@/models/loan.model"
import LoanService from "@/services/loan.service"
import { ServiceErrorCode } from "@/services/service.result"
import { ErrorService } from "@/services/error.service"

interface EndLoanDialogProps {
  isOpen: boolean
  onClose: () => void
  onLoanEnded: () => void
  loan: ILoanWithAssociations
}

export function EndLoanDialog({ isOpen, onClose, onLoanEnded, loan }: EndLoanDialogProps) {
  const [endDate, setEndDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setEndDate(`${year}-${month}-${day}T${hours}:${minutes}`);
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!endDate) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const updateResult = await LoanService.updateLoan(loan.id!, { endDate: new Date(endDate) });
      
      if (updateResult && updateResult.errorCode === ServiceErrorCode.success) {
        onLoanEnded()
        onClose()
      } else if (updateResult?.errorCode === ServiceErrorCode.conflict) {
        ErrorService.errorMessage("Conflit de Dates", "Impossible de mettre à jour le prêt : conflit de dates détecté.");
      } else {
        ErrorService.errorMessage("Erreur", "Impossible de mettre à jour le prêt");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du prêt:", error)
      ErrorService.errorMessage("Erreur", "Une erreur s'est produite lors de la mise à jour du prêt");
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
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
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Arrêter le Prêt</h2>
                  <p className="text-sm text-gray-400">Définir la date de fin du prêt</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Informations du prêt */}
              <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
                <div className="text-sm text-gray-400 mb-2">Prêt en cours</div>
                <div className="text-white font-medium text-lg">
                  {loan.customer?.firstName} {loan.customer?.lastName}
                </div>
                <div className="text-gray-300 text-base font-mono">
                  OR #{loan.orNumber}
                </div>
                <div className="text-gray-300 text-sm mt-1">
                  Début: {new Date(loan.startDate).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* Date de fin */}
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-gray-300">
                  Date et heure de fin *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 bg-gray-700/60 border-gray-600 text-white focus:border-green-400"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  La date et heure actuelles sont pré-remplies mais peuvent être modifiées
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 bg-transparent hover:bg-gray-400/10"
                >
                  Annuler
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-green-500/25"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mise à jour...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Arrêter le prêt</span>
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
