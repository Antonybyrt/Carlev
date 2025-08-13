"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Car, Archive, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ILoanerCarWithAssociations } from "@/models/loaner-car.model"

interface ArchiveLoanerCarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoanerCarArchived: () => void;
  loanerCar: ILoanerCarWithAssociations | null;
}

export function ArchiveLoanerCarDialog({
  isOpen,
  onClose,
  onLoanerCarArchived,
  loanerCar
}: ArchiveLoanerCarDialogProps) {
  if (!loanerCar) return null;

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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="bg-gray-800/90 backdrop-blur-sm border-orange-500/30 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Archive className="w-8 h-8 text-orange-400" />
                </div>
                <CardTitle className="text-xl text-white">Archiver la Voiture de Prêt</CardTitle>
                <CardDescription className="text-gray-300">
                  Cette action masquera la voiture de prêt de la liste
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Informations de la voiture */}
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Car className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {loanerCar.brand?.brandName} {loanerCar.model?.modelName}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {loanerCar.registration?.registrationName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Marque:</span>
                      <span className="text-white">{loanerCar.brand?.brandName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Modèle:</span>
                      <span className="text-white">{loanerCar.model?.modelName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Plaque:</span>
                      <span className="text-white font-mono">{loanerCar.registration?.registrationName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Statut:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        loanerCar.status === 'DISPONIBLE' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : loanerCar.status === 'EN_PRET'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                        {loanerCar.status === 'DISPONIBLE' && 'Disponible'}
                        {loanerCar.status === 'EN_PRET' && 'En prêt'}
                        {loanerCar.status === 'EN_MAINTENANCE' && 'Maintenance'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Information sur l'archivage */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Archive className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-orange-300 font-medium mb-1">Archivage</p>
                      <p className="text-orange-400">
                        La voiture de prêt sera masquée de la liste principale mais restera dans la base de données.
                        Vous pourrez la restaurer ultérieurement si nécessaire.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 bg-transparent hover:bg-gray-400/10"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={onLoanerCarArchived}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white border-orange-600 hover:border-orange-700"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archiver
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