"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Car, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import auth from "@/services/auth.service"
import { ErrorService } from "@/services/error.service"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      ErrorService.errorMessage("Champs manquants", "Veuillez remplir tous les champs")
      return
    }

    setIsLoading(true)
    try {
      const result = await auth.login(email, password)
      if (result) {
        setTimeout(() => {
          router.push("/")
        }, 1500) // Délai un peu plus long pour voir le toast
      }
    } catch (error) {
      ErrorService.errorMessage("Erreur inattendue", "Une erreur est survenue lors de la connexion")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Fond animé avec gradients */}
      <div className="absolute inset-0">
        {/* Gradient principal fixe (sans animation) */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/50 to-indigo-900/60" />
        
        {/* Formes géométriques flottantes */}
        {/* Triangle 1 - Violet */}
        <motion.div
          animate={{
            x: [0, 200, -150, 100, 0],
            y: [0, -100, 150, -80, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-purple-500/40"
        />
        
        {/* Triangle 2 - Bleu */}
        <motion.div
          animate={{
            x: [0, -180, 120, -90, 0],
            y: [0, 120, -60, 100, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear",
            delay: 5
          }}
          className="absolute top-32 right-20 w-0 h-0 border-l-[25px] border-r-[25px] border-b-[43px] border-l-transparent border-r-transparent border-b-blue-500/40"
        />
        
        {/* Triangle 3 - Indigo */}
        <motion.div
          animate={{
            x: [0, 160, -120, 80, 0],
            y: [0, -80, 140, -60, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 55,
            repeat: Infinity,
            ease: "linear",
            delay: 10
          }}
          className="absolute bottom-28 left-1/4 w-0 h-0 border-l-[18px] border-r-[18px] border-b-[31px] border-l-transparent border-r-transparent border-b-indigo-500/40"
        />
        
        {/* Carré 1 - Cyan */}
        <motion.div
          animate={{
            x: [0, -150, 100, -80, 0],
            y: [0, 80, -120, 60, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
            delay: 3
          }}
          className="absolute top-1/3 left-1/3 w-8 h-8 bg-cyan-500/40 rotate-45"
        />
        
        {/* Carré 2 - Violet */}
        <motion.div
          animate={{
            x: [0, 120, -100, 80, 0],
            y: [0, -60, 100, -40, 0],
            rotate: [0, -90, -180, -270, -360],
          }}
          transition={{
            duration: 42,
            repeat: Infinity,
            ease: "linear",
            delay: 7
          }}
          className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-purple-500/40 rotate-45"
        />
        
        {/* Ligne 1 - Bleu */}
        <motion.div
          animate={{
            x: [0, 120, -80, 60, 0],
            y: [0, -60, 80, -40, 0],
            rotate: [0, 45, 90, 135, 180],
          }}
          transition={{
            duration: 48,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
          className="absolute top-1/2 left-1/2 w-16 h-0.5 bg-blue-500/40"
        />
        
        {/* Ligne 2 - Indigo */}
        <motion.div
          animate={{
            x: [0, -100, 80, -60, 0],
            y: [0, 60, -80, 40, 0],
            rotate: [0, -45, -90, -135, -180],
          }}
          transition={{
            duration: 52,
            repeat: Infinity,
            ease: "linear",
            delay: 8
          }}
          className="absolute top-2/3 right-1/3 w-12 h-0.5 bg-indigo-500/40"
        />
        
        {/* Formes supplémentaires pour couvrir plus de surface */}
        {/* Petit triangle - Cyan */}
        <motion.div
          animate={{
            x: [0, 180, -140, 90, 0],
            y: [0, -120, 160, -100, 0],
            rotate: [0, 120, 240, 360],
          }}
          transition={{
            duration: 58,
            repeat: Infinity,
            ease: "linear",
            delay: 12
          }}
          className="absolute top-16 right-1/3 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-cyan-500/40"
        />
        
        {/* Petit carré - Bleu */}
        <motion.div
          animate={{
            x: [0, -160, 110, -70, 0],
            y: [0, 90, -130, 70, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 44,
            repeat: Infinity,
            ease: "linear",
            delay: 15
          }}
          className="absolute bottom-20 left-1/2 w-5 h-5 bg-blue-500/40 rotate-45"
        />
        
        {/* Ligne courte - Violet */}
        <motion.div
          animate={{
            x: [0, 140, -90, 70, 0],
            y: [0, -70, 110, -50, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 46,
            repeat: Infinity,
            ease: "linear",
            delay: 18
          }}
          className="absolute top-3/4 left-1/6 w-10 h-0.5 bg-purple-500/40"
        />
        
        {/* Particules flottantes */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full"
        />
        
        <motion.div
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full"
        />
        
        <motion.div
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full"
        />
        
        <motion.div
          animate={{
            y: [0, -18, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute top-2/3 left-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full"
        />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 bg-gray-900/30 backdrop-blur-xl border border-gray-700/30">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <Car className="w-8 h-8 text-white" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  CarLev
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Connexion à votre compte carrosserie
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent>
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-gray-600 focus:border-blue-400 transition-all duration-300 bg-gray-800/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 border-gray-600 focus:border-blue-400 transition-all duration-300 bg-gray-800/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-blue-500/25"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Connexion en cours...</span>
                      </div>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-gray-400">
                  Système de gestion de pièces automobiles
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 