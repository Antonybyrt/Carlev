"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ILoanWithAssociations } from "@/models/loan.model"

interface DeleteLoanDialogProps {
  isOpen: boolean
  onClose: () => void
  onLoanDeleted: () => void
  loan: ILoanWithAssociations | null
}

export function DeleteLoanDialog({ isOpen, onClose, onLoanDeleted, loan }: DeleteLoanDialogProps) {
  if (!loan) return null

  const handleDelete = async () => {
    try {
      onLoanDeleted()
      onClose()
    } catch (error) {
      console.error("Erreur lors de la suppression du prêt:", error)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="bg-gray-800/90 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="w-8 h-8 text-red-400" />
                </div>
                <CardTitle className="text-xl text-white">Supprimer le Prêt</CardTitle>
                <CardDescription className="text-gray-300">
                  Êtes-vous sûr de vouloir supprimer ce prêt ?
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Informations du prêt */}
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm text-gray-400 uppercase tracking-wide font-semibold mb-1">Client</h4>
                      <p className="text-white font-medium">
                        {loan.customer?.firstName} {loan.customer?.lastName}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-400 uppercase tracking-wide font-semibold mb-1">Numéro OR</h4>
                      <p className="text-white font-mono font-medium">#{loan.orNumber}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-400 uppercase tracking-wide font-semibold mb-1">Période</h4>
                      <div className="text-sm text-gray-400">
                        {new Date(loan.startDate).toLocaleDateString('fr-FR')} - {loan.endDate ? new Date(loan.endDate).toLocaleDateString('fr-FR') : 'Non définie'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Avertissement */}
                <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-300 text-sm font-medium">Action irréversible</p>
                    <p className="text-yellow-400/80 text-xs mt-1">
                      Cette action ne peut pas être annulée. Le prêt sera définitivement supprimé.
                    </p>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex space-x-3">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 focus:ring-red-500"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
