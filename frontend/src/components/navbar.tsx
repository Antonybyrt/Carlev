"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { LogOut, Car, Package, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import auth from "@/services/auth.service"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function Navbar() {
  const router = useRouter()
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(31, 41, 55, 0.3)", "rgba(31, 41, 55, 0.9)"]
  )

  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(8px)", "blur(20px)"]
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await auth.logout()
    router.push("/auth/login")
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor,
        backdropFilter: backdropBlur
      }}
      className={`border-b border-gray-700/50 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg shadow-black/20' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CarLev
            </span>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {/* Bouton Nouvelle Commande */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                onClick={() => router.push("/newOrder")}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 border-gray-600/50 hover:border-blue-400/70 bg-transparent hover:bg-blue-400/10 backdrop-blur-sm"
              >
                <Package className="w-4 h-4" />
                <span>Nouvelle Commande</span>
              </Button>
            </motion.div>

            {/* Bouton Mes Commandes */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                onClick={() => router.push("/myOrders")}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 text-gray-300 hover:text-green-400 border-gray-600/50 hover:border-green-400/70 bg-transparent hover:bg-green-400/10 backdrop-blur-sm"
              >
                <FileText className="w-4 h-4" />
                <span>Mes Commandes</span>
              </Button>
            </motion.div>

            {/* Bouton Déconnexion */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 text-gray-300 hover:text-red-400 border-gray-600/50 hover:border-red-400/70 bg-transparent hover:bg-red-400/10 backdrop-blur-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
} 