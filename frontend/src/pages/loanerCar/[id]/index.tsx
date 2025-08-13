"use client"

import { motion } from "framer-motion"
import { Car, Edit, Archive, User, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { AuthGuard } from "@/components/auth-guard"
import { ArchiveLoanerCarDialog } from "@/components/dialog"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ErrorService } from "@/services/error.service"
import { ServiceErrorCode } from "@/services/service.result"
import LoanerCarService from "@/services/loaner-car.service"
import LoanService from "@/services/loan.service"
import { ILoanerCarWithAssociations } from "@/models/loaner-car.model"
import { ILoanWithAssociations } from "@/models/loan.model"

export default function LoanerCarDetailPage() {
  const router = useRouter();
  const params = useParams();
  const loanerCarId = parseInt(params.id as string);
  
  const [loanerCar, setLoanerCar] = useState<ILoanerCarWithAssociations | null>(null);
  const [loans, setLoans] = useState<ILoanWithAssociations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLoans, setIsLoadingLoans] = useState(true);
  const [isDeleteLoanerCarDialogOpen, setIsDeleteLoanerCarDialogOpen] = useState(false);

  useEffect(() => {
    const loadLoanerCar = async () => {
      if (!loanerCarId) return;
      
      setIsLoading(true);
      try {
        const result = await LoanerCarService.getLoanerCarById(loanerCarId);
        if (result && result.errorCode === ServiceErrorCode.success && result.result) {
          setLoanerCar(result.result);
        } else {
          ErrorService.errorMessage("Erreur", "Impossible de récupérer la voiture de prêt");
          router.push("/loanerCar");
          return;
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la voiture de prêt:", error);
        ErrorService.errorMessage("Erreur", "Une erreur s'est produite lors de la récupération de la voiture de prêt");
        router.push("/loanerCar");
        return;
      } finally {
        setIsLoading(false);
      }
    };

    const loadLoans = async () => {
      if (!loanerCarId) return;
      
      setIsLoadingLoans(true);
      try {
        const result = await LoanService.getAllLoans();
        if (result && result.errorCode === ServiceErrorCode.success) {
          // Filtrer les prêts pour cette voiture de prêt
          const filteredLoans = result.result?.filter(loan => loan.loanerCarId === loanerCarId) || [];
          setLoans(filteredLoans);
        } else {
          setLoans([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des prêts:", error);
        setLoans([]);
      } finally {
        setIsLoadingLoans(false);
      }
    };

    loadLoanerCar();
    loadLoans();
  }, [loanerCarId, router]);

  const onLoanerCarDeleted = async () => {
    if (!loanerCar) return;
    
    try {
      const result = await LoanerCarService.deleteLoanerCar(loanerCar.id!);
      if (!result || result.errorCode !== ServiceErrorCode.success) {
        ErrorService.errorMessage("Erreur", "Impossible de supprimer la voiture de prêt");
        return;
      }

      ErrorService.successMessage("Succès", "Voiture de prêt supprimée avec succès !");
      router.push("/loanerCar");
    } catch (error) {
      console.error("Erreur lors de la suppression de la voiture de prêt:", error);
      ErrorService.errorMessage("Erreur", "Une erreur s'est produite lors de la suppression de la voiture de prêt");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIBLE':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'EN_PRET':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'EN_MAINTENANCE':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DISPONIBLE':
        return 'Disponible';
      case 'EN_PRET':
        return 'En prêt';
      case 'EN_MAINTENANCE':
        return 'En maintenance';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <Navbar />
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            <span className="ml-3 text-gray-400">Chargement de la voiture de prêt...</span>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!loanerCar) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <Navbar />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Car className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-300 mb-2">Voiture de prêt non trouvée</h2>
              <Button onClick={() => router.push("/loanerCar")} className="mt-4">
                Retour à la liste
              </Button>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Détails de la Voiture de Prêt</h1>
                <p className="text-gray-400">Informations complètes et historique des prêts</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteLoanerCarDialogOpen(true)}
                className="border-orange-500/30 text-orange-400 hover:text-orange-300 hover:border-orange-400 hover:bg-orange-500/10"
              >
                <Archive className="w-4 h-4 mr-2" />
                Archiver
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informations de la voiture */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center space-x-2">
                    <Car className="w-6 h-6 text-blue-400" />
                    <span>Informations du Véhicule</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Statut */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-700">
                    <span className="text-gray-300 font-medium">Statut actuel</span>
                    <div className={`px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(loanerCar.status)}`}>
                      {getStatusText(loanerCar.status)}
                    </div>
                  </div>

                  {/* Informations du véhicule */}
                  <div className="space-y-6">
                    {/* Marque et Modèle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Marque</h4>
                        <p className="text-white text-xl font-semibold">
                          {loanerCar.brand?.brandName || "Non spécifiée"}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Modèle</h4>
                        <p className="text-white text-xl font-semibold">
                          {loanerCar.model?.modelName || "Non spécifié"}
                        </p>
                      </div>
                    </div>

                    {/* Plaque d'immatriculation */}
                    <div>
                      <h4 className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Plaque d'immatriculation</h4>
                      <div className="text-white font-mono font-bold text-2xl bg-gray-800 px-4 py-3 rounded border border-gray-600">
                        {loanerCar.registration?.registrationName || "Non spécifiée"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Prêt en cours */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center space-x-2">
                    <Calendar className="w-6 h-6 text-green-400" />
                    <span>Prêt en Cours</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  {loans.length > 0 && loans.some(loan => {
                    const now = new Date();
                    const startDate = new Date(loan.startDate);
                    const endDate = new Date(loan.endDate);
                    return startDate <= now && now <= endDate;
                  }) ? (
                    loans.filter(loan => {
                      const now = new Date();
                      const startDate = new Date(loan.startDate);
                      const endDate = new Date(loan.endDate);
                      return startDate <= now && now <= endDate;
                    }).map((activeLoan) => (
                      <div key={activeLoan.id} className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 font-medium text-lg">Prêt actif</span>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm text-gray-400 mb-2 uppercase tracking-wide font-semibold">Client</h4>
                            <p className="text-white text-xl font-bold">
                              {activeLoan.customer?.firstName} {activeLoan.customer?.lastName}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm text-gray-400 mb-2 uppercase tracking-wide font-semibold">Numéro OR</h4>
                            <p className="text-white font-mono text-lg font-semibold">#{activeLoan.orNumber}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm text-gray-400 mb-2 uppercase tracking-wide font-semibold">Date début</h4>
                              <p className="text-white text-lg font-medium">{formatDate(activeLoan.startDate)}</p>
                            </div>
                            <div>
                              <h4 className="text-sm text-gray-400 mb-2 uppercase tracking-wide font-semibold">Date fin</h4>
                              <p className="text-white text-lg font-medium">{formatDate(activeLoan.endDate)}</p>
                            </div>
                          </div>
                          
                          {activeLoan.notes && (
                            <div>
                              <h4 className="text-sm text-gray-400 mb-2 uppercase tracking-wide font-semibold">Notes</h4>
                              <p className="text-gray-300 text-base italic">"{activeLoan.notes}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Aucun prêt en cours</p>
                      <p className="text-gray-500 text-sm">Cette voiture est actuellement disponible</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Historique des prêts - Carte pleine largeur */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-purple-400" />
                  <span>Historique des Prêts</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Tous les prêts effectués avec cette voiture
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoadingLoans ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
                    <span className="ml-3 text-gray-400">Chargement des prêts...</span>
                  </div>
                ) : loans.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Aucun prêt enregistré</p>
                    <p className="text-gray-500 text-sm">Cette voiture n'a pas encore été prêtée</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {loans.map((loan) => (
                      <div
                        key={loan.id}
                        className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-3">
                              <User className="w-5 h-5 text-blue-400" />
                              <h4 className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Client</h4>
                            </div>
                            <div className="text-white text-xl font-bold mb-2">
                              {loan.customer?.firstName} {loan.customer?.lastName}
                            </div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Numéro OR</h4>
                              <span className="text-white font-mono text-lg font-semibold">
                                #{loan.orNumber}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-semibold">Période</div>
                            <div className="text-white text-base font-medium">
                              {formatDate(loan.startDate)} - {formatDate(loan.endDate)}
                            </div>
                          </div>
                        </div>
                        
                        {loan.notes && (
                          <div className="mt-4 pt-4 border-t border-gray-600">
                            <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-semibold">Notes</div>
                            <div className="text-gray-300 text-base italic">
                              "{loan.notes}"
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </main>

        <ArchiveLoanerCarDialog
          isOpen={isDeleteLoanerCarDialogOpen}
          onClose={() => setIsDeleteLoanerCarDialogOpen(false)}
          onLoanerCarArchived={onLoanerCarDeleted}
          loanerCar={loanerCar}
        />
      </div>
    </AuthGuard>
  )
} 