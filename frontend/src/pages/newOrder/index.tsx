"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Package, Car, User, CreditCard, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { AuthGuard } from "@/components/auth-guard"
import { useRouter } from "next/navigation"

export default function NewOrderPage() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique de soumission de commande à implémenter
    console.log("Nouvelle commande soumise")
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Nouvelle Commande</h1>
                <p className="text-gray-400">Passez une commande de pièces automobiles</p>
              </div>
            </div>
          </motion.div>

          {/* Formulaire de commande */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center space-x-2">
                  <Package className="w-6 h-6 text-blue-400" />
                  <span>Détails de la Commande</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Remplissez les informations pour votre commande de pièces
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Informations client */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <User className="w-5 h-5 text-blue-400" />
                      <span>Informations Client</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientName" className="text-gray-300">Nom du client</Label>
                        <Input
                          id="clientName"
                          placeholder="Nom complet du client"
                          className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="clientPhone" className="text-gray-300">Téléphone</Label>
                        <Input
                          id="clientPhone"
                          placeholder="Numéro de téléphone"
                          className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informations véhicule */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <Car className="w-5 h-5 text-blue-400" />
                      <span>Véhicule</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="brand" className="text-gray-300">Marque</Label>
                        <Select>
                          <SelectTrigger className="bg-gray-700/60 border-gray-600 text-white">
                            <SelectValue placeholder="Sélectionner une marque" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="renault">Renault</SelectItem>
                            <SelectItem value="peugeot">Peugeot</SelectItem>
                            <SelectItem value="citroen">Citroën</SelectItem>
                            <SelectItem value="volkswagen">Volkswagen</SelectItem>
                            <SelectItem value="bmw">BMW</SelectItem>
                            <SelectItem value="mercedes">Mercedes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="model" className="text-gray-300">Modèle</Label>
                        <Input
                          id="model"
                          placeholder="Modèle du véhicule"
                          className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="year" className="text-gray-300">Année</Label>
                        <Input
                          id="year"
                          type="number"
                          placeholder="2024"
                          min="1990"
                          max="2024"
                          className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Détails de la commande */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span>Détails de la Commande</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="parts" className="text-gray-300">Pièces demandées</Label>
                        <Textarea
                          id="parts"
                          placeholder="Décrivez les pièces nécessaires..."
                          rows={4}
                          className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 resize-none"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="priority" className="text-gray-300">Priorité</Label>
                          <Select>
                            <SelectTrigger className="bg-gray-700/60 border-gray-600 text-white">
                              <SelectValue placeholder="Niveau de priorité" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="low">Basse</SelectItem>
                              <SelectItem value="medium">Moyenne</SelectItem>
                              <SelectItem value="high">Haute</SelectItem>
                              <SelectItem value="urgent">Urgente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="budget" className="text-gray-300">Budget estimé (€)</Label>
                          <Input
                            id="budget"
                            type="number"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Passer la Commande
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/myOrders")}
                      className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Voir Mes Commandes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </AuthGuard>
  )
} 