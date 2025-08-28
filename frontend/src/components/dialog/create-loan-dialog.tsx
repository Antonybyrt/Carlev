"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, FileText, Calendar, MessageSquare, Save, Loader2, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ILoanerCarWithAssociations } from "@/models/loaner-car.model"
import { ICustomer } from "@/models/customer.model"
import CustomerService from "@/services/customer.service"
import { ServiceErrorCode } from "@/services/service.result"
import { CreateCustomerDialog, DeleteCustomerDialog } from "@/components/dialog"

interface CreateLoanDialogProps {
  isOpen: boolean
  onClose: () => void
  onLoanCreated: (loanData: any) => void
  loanerCar: ILoanerCarWithAssociations
}

export function CreateLoanDialog({ isOpen, onClose, onLoanCreated, loanerCar }: CreateLoanDialogProps) {
  const [customers, setCustomers] = useState<ICustomer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  const [orNumber, setOrNumber] = useState("")
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)
  const [isCreateCustomerDialogOpen, setIsCreateCustomerDialogOpen] = useState(false)
  const [isDeleteCustomerDialogOpen, setIsDeleteCustomerDialogOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadCustomers()
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setStartDate(`${year}-${month}-${day}T${hours}:${minutes}`);
    }
  }, [isOpen])

  useEffect(() => {
    if (customerSearchTerm) {
      const filtered = customers.filter(customer => 
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(customerSearchTerm.toLowerCase())
      )
      setFilteredCustomers(filtered)
    } else {
      setFilteredCustomers(customers)
    }
  }, [customerSearchTerm, customers])

  const loadCustomers = async () => {
    setIsLoadingCustomers(true)
    try {
      const result = await CustomerService.getAllCustomers()
      if (result && result.errorCode === ServiceErrorCode.success) {
        setCustomers(result.result || [])
        setFilteredCustomers(result.result || [])
      }
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error)
    } finally {
      setIsLoadingCustomers(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCustomer || !orNumber || !startDate) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const customer = customers.find(c => c.id?.toString() === selectedCustomer)
      if (!customer) {
        throw new Error("Client non trouvé")
      }

      const loanData = {
        customerId: customer.id,
        orNumber: parseInt(orNumber),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        notes,
        loanerCarId: loanerCar.id
      }
      
      onLoanCreated(loanData)
      
      setSelectedCustomer("")
      setOrNumber("")
      setStartDate("")
      setEndDate("")
      setNotes("")
      setCustomerSearchTerm("")
      
      onClose()
    } catch (error) {
      console.error("Erreur lors de la création du prêt:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedCustomer("")
      setOrNumber("")
      setStartDate("")
      setEndDate("")
      setNotes("")
      setCustomerSearchTerm("")
      onClose()
    }
  }

  const handleCustomerCreated = () => {
    loadCustomers()
  }

  const handleCustomerDeleted = () => {
    setSelectedCustomer("")
    setCustomerSearchTerm("")
    loadCustomers()
  }

  return (
    <>
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
            className="relative w-full max-w-lg mx-4 bg-gray-800 rounded-lg shadow-2xl border border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Créer un prêt</h2>
                  <p className="text-sm text-gray-400">Prêter cette voiture à un client</p>
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
              {/* Informations du véhicule */}
              <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
                <div className="text-sm text-gray-400 mb-2">Véhicule sélectionné</div>
                <div className="text-white font-medium text-lg">
                  {loanerCar.brand?.brandName} {loanerCar.model?.modelName}
                </div>
                <div className="text-gray-300 text-base font-mono">
                  {loanerCar.registration?.registrationName}
                </div>
              </div>

              <div className="space-y-4">
                {/* Sélection du client */}
                <div className="space-y-2">
                  <Label htmlFor="customer" className="text-gray-300">
                    Client *
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="customer"
                      placeholder={selectedCustomer ? 
                        `${customers.find(c => c.id?.toString() === selectedCustomer)?.firstName} ${customers.find(c => c.id?.toString() === selectedCustomer)?.lastName} (sélectionné)` : 
                        "Tapez pour rechercher un client..."
                      }
                      value={selectedCustomer ? 
                        `${customers.find(c => c.id?.toString() === selectedCustomer)?.firstName} ${customers.find(c => c.id?.toString() === selectedCustomer)?.lastName}` || "" : 
                        customerSearchTerm
                      }
                      onChange={(e) => {
                        const searchValue = e.target.value;
                        setCustomerSearchTerm(searchValue);
                        
                        if (searchValue !== `${customers.find(c => c.id?.toString() === selectedCustomer)?.firstName} ${customers.find(c => c.id?.toString() === selectedCustomer)?.lastName}`) {
                          setSelectedCustomer("");
                        }
                      }}
                      onFocus={() => {
                        const dropdown = document.getElementById('customerDropdown');
                        if (dropdown) dropdown.classList.remove('hidden');
                      }}
                      className="pl-10 bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                      required
                      disabled={isSubmitting}
                    />
                    
                    {/* Liste déroulante des clients */}
                    <div 
                      id="customerDropdown"
                      className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto hidden"
                      onMouseLeave={() => {
                        setTimeout(() => {
                          const dropdown = document.getElementById('customerDropdown');
                          if (dropdown) dropdown.classList.add('hidden');
                        }, 100);
                      }}
                    >
                      {isLoadingCustomers ? (
                        <div className="px-3 py-2 text-gray-400 text-sm">Chargement des clients...</div>
                      ) : filteredCustomers.length === 0 ? (
                        <div className="px-3 py-2 text-gray-400 text-sm">Aucun client trouvé</div>
                      ) : (
                        filteredCustomers.map(customer => (
                          <div
                            key={customer.id}
                            className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                            onClick={() => {
                              setSelectedCustomer(customer.id?.toString() || "");
                              setCustomerSearchTerm("");
                              const dropdown = document.getElementById('customerDropdown');
                              if (dropdown) dropdown.classList.add('hidden');
                            }}
                          >
                            {customer.firstName} {customer.lastName}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Boutons pour gérer les clients */}
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateCustomerDialogOpen(true)}
                    className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10 flex-1"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDeleteCustomerDialogOpen(true)}
                    disabled={!selectedCustomer}
                    className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-red-400 bg-transparent hover:bg-red-400/10 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>

                {/* Numéro OR */}
                <div className="space-y-2">
                  <Label htmlFor="orNumber" className="text-gray-300">
                    Numéro OR *
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="orNumber"
                      value={orNumber}
                      onChange={(e) => setOrNumber(e.target.value)}
                      placeholder="Numéro de commande"
                      type="number"
                      className="pl-10 bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-gray-300">
                      Date début *
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="pl-10 bg-gray-700/60 border-gray-600 text-white focus:border-blue-400"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-gray-300">
                      Date fin
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      />
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="pl-10 bg-gray-700/60 border-gray-600 text-white focus:border-blue-400"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-gray-300">
                    Notes
                  </Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Notes optionnelles..."
                      className="pl-10 bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 min-h-[80px]"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10"
                >
                  Annuler
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-blue-500/25"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Création...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Créer le prêt</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* Dialogs pour gérer les clients */}
    <CreateCustomerDialog
      isOpen={isCreateCustomerDialogOpen}
      onClose={() => setIsCreateCustomerDialogOpen(false)}
      onCustomerCreated={handleCustomerCreated}
      loginId={1}
    />
    <DeleteCustomerDialog
      isOpen={isDeleteCustomerDialogOpen}
      onClose={() => setIsDeleteCustomerDialogOpen(false)}
      onCustomerDeleted={handleCustomerDeleted}
      customer={customers.find(c => c.id?.toString() === selectedCustomer) || null}
    />
  </>
  )
}
