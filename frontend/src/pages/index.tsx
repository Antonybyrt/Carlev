"use client"

import { motion } from "framer-motion"
import { Car, Package, Users, FileText, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { AuthGuard } from "@/components/auth-guard"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Gestion des Clients",
      description: "Gérez vos clients et leurs informations"
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: "Catalogue Automobile",
      description: "Marques et modèles de véhicules"
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Inventaire",
      description: "Gestion des pièces et articles"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Commandes",
      description: "Suivi des commandes de pièces"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Statistiques",
      description: "Rapports et compteurs par compte"
    }
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Bienvenue sur CarLev !
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Gérez efficacement votre répertoire de commandes de pièces automobiles pour carrosserie
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="h-full bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Actions Rapides
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => router.push("/newOrder")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Nouvelle Commande
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => router.push("/myOrders")}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Mes Commandes
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="px-6 py-3 border-gray-600 text-gray-300 hover:text-white hover:border-purple-400 bg-transparent hover:bg-purple-400/10 transition-all duration-200"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Voir Statistiques
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </AuthGuard>
  )
}
