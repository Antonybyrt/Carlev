"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import auth from "@/services/auth.service"
import { IUser } from "@/models/user.model"
import { ServiceErrorCode } from "@/services/service.result"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("Token")
        if (!token) {
          console.log("Aucun token trouvé, redirection vers la page de connexion")
          router.push("/auth/login")
          return
        }

        const authResult = await auth.isLogged()
        if (authResult.errorCode === ServiceErrorCode.success && authResult.result) {
          setUser(authResult.result)
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem("Token")
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("Erreur lors de la vérification d'authentification:", error)
        localStorage.removeItem("Token")
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <span className="ml-3 text-gray-400">Vérification de l'authentification...</span>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return <>{children}</>
} 