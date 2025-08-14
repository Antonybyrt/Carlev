"use client"

import { motion } from "framer-motion"
import { Car, Edit, Archive, User, FileText, Calendar, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { AuthGuard } from "@/components/auth-guard"
import { CreateLoanDialog, DeleteLoanDialog, ArchiveLoanerCarDialog } from "@/components/dialog"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ErrorService } from "@/services/error.service"
import { ServiceErrorCode } from "@/services/service.result"
import LoanerCarService from "@/services/loaner-car.service"
import LoanService from "@/services/loan.service"
import { ILoanerCarWithAssociations } from "@/models/loaner-car.model"
import { ILoanWithAssociations } from "@/models/loan.model"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function LoanerCarDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [loanerCarId, setLoanerCarId] = useState<number | null>(null);
  
  const [loanerCar, setLoanerCar] = useState<ILoanerCarWithAssociations | null>(null);
  const [loans, setLoans] = useState<ILoanWithAssociations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLoans, setIsLoadingLoans] = useState(true);
  const [isDeleteLoanerCarDialogOpen, setIsDeleteLoanerCarDialogOpen] = useState(false);
  const [isCreateLoanDialogOpen, setIsCreateLoanDialogOpen] = useState(false);
  const [isDeleteLoanDialogOpen, setIsDeleteLoanDialogOpen] = useState(false);
  const [selectedLoanForDeletion, setSelectedLoanForDeletion] = useState<ILoanWithAssociations | null>(null);

  
  const [loanSearchCustomer, setLoanSearchCustomer] = useState<string>("");
  const [loanSearchStartDate, setLoanSearchStartDate] = useState<string>("");
  const [loanSearchEndDate, setLoanSearchEndDate] = useState<string>("");
  const [loanSearchOrNumber, setLoanSearchOrNumber] = useState<string>("");
  const [filteredLoans, setFilteredLoans] = useState<ILoanWithAssociations[]>([]);

  
  const [currentLoanPage, setCurrentLoanPage] = useState(1);
  const [loansPerPage] = useState(5);

  useEffect(() => {
    if (params?.id) {
      const id = parseInt(params.id as string);
      if (!isNaN(id)) {
        setLoanerCarId(id);
      } else {
        ErrorService.errorMessage("Erreur", "ID de voiture de prêt invalide");
        router.push("/loanerCar");
      }
    }
  }, [params, router]);

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

  
  useEffect(() => {
    let filtered = loans;

    if (loanSearchCustomer.trim()) {
      filtered = filtered.filter(loan => 
        loan.customer?.firstName?.toLowerCase().includes(loanSearchCustomer.toLowerCase()) ||
        loan.customer?.lastName?.toLowerCase().includes(loanSearchCustomer.toLowerCase())
      );
    }

    if (loanSearchStartDate) {
      filtered = filtered.filter(loan => {
        const loanStartDate = new Date(loan.startDate);
        const searchStartDate = new Date(loanSearchStartDate);
        return loanStartDate.toDateString() === searchStartDate.toDateString();
      });
    }

    if (loanSearchEndDate) {
      filtered = filtered.filter(loan => {
        const loanEndDate = new Date(loan.endDate);
        const searchEndDate = new Date(loanSearchEndDate);
        return loanEndDate.toDateString() === searchEndDate.toDateString();
      });
    }

    if (loanSearchOrNumber.trim()) {
      filtered = filtered.filter(loan => 
        loan.orNumber.toString().includes(loanSearchOrNumber)
      );
    }

    setFilteredLoans(filtered);
    setCurrentLoanPage(1);
  }, [loans, loanSearchCustomer, loanSearchStartDate, loanSearchEndDate, loanSearchOrNumber]);

  
  const totalLoanPages = Math.ceil(filteredLoans.length / loansPerPage);
  const startLoanIndex = (currentLoanPage - 1) * loansPerPage;
  const endLoanIndex = startLoanIndex + loansPerPage;
  const currentLoans = filteredLoans.slice(startLoanIndex, endLoanIndex);

  const goToLoanPage = (page: number) => {
    setCurrentLoanPage(page);
  };

  const goToNextLoanPage = () => {
    if (currentLoanPage < totalLoanPages) {
      setCurrentLoanPage(currentLoanPage + 1);
    }
  };

  const goToPreviousLoanPage = () => {
    if (currentLoanPage > 1) {
      setCurrentLoanPage(currentLoanPage - 1);
    }
  };

  const goToFirstLoanPage = () => {
    setCurrentLoanPage(1);
  };

  const goToLastLoanPage = () => {
    setCurrentLoanPage(totalLoanPages);
  };

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

  const handleStatusChange = async (newStatus: string) => {
    if (!loanerCar) return;
    
    try {
      
      if (newStatus === 'DISPONIBLE' && loanerCar.status === 'EN_PRET') {
        
        const activeLoan = loans.find(loan => {
          const now = new Date();
          const startDate = new Date(loan.startDate);
          const endDate = new Date(loan.endDate);
          return startDate <= now && now <= endDate;
        });

        if (activeLoan) {
          const today = new Date();
          const originalEndDate = new Date(activeLoan.endDate);
          
          if (today < originalEndDate) {
            const updateResult = await LoanService.updateLoan(activeLoan.id!, { endDate: today });
            
            if (!updateResult || updateResult.errorCode !== ServiceErrorCode.success) {
              if (updateResult?.errorCode === ServiceErrorCode.conflict) {
                ErrorService.errorMessage("Conflit de Dates", "Impossible de mettre à jour le prêt : conflit de dates détecté.");
              } else {
                ErrorService.errorMessage("Erreur", "Impossible de mettre à jour le prêt");
              }
              return;
            }

            const loadLoans = async () => {
              try {
                const result = await LoanService.getAllLoans();
                if (result && result.errorCode === ServiceErrorCode.success) {
                  const filteredLoans = result.result?.filter(loan => loan.loanerCarId === loanerCar.id) || [];
                  setLoans(filteredLoans);
                }
              } catch (error) {
                console.error("Erreur lors du rechargement des prêts:", error);
              }
            };
            loadLoans();
          }
        }
      }

      
      const result = await LoanerCarService.updateLoanerCar(loanerCar.id!, { status: newStatus });
      if (!result || result.errorCode !== ServiceErrorCode.success) {
        ErrorService.errorMessage("Erreur", "Impossible de mettre à jour le statut de la voiture de prêt");
        return;
      }

      setLoanerCar(prev => prev ? { ...prev, status: newStatus } : null);
      
      let successMessage = "";
      switch (newStatus) {
        case 'EN_PRET':
          successMessage = "Voiture mise en prêt avec succès !";
          break;
        case 'EN_MAINTENANCE':
          successMessage = "Voiture mise en maintenance avec succès !";
          break;
        case 'DISPONIBLE':
          if (loanerCar.status === 'EN_PRET') {
            successMessage = "Prêt arrêté avec succès !";
          } else {
            successMessage = "Maintenance terminée avec succès !";
          }
          break;
        default:
          successMessage = "Statut mis à jour avec succès !";
      }
      
      ErrorService.successMessage("Succès", successMessage);
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      ErrorService.errorMessage("Erreur", "Une erreur s'est produite lors de la mise à jour du statut");
    }
  };

  const handleLoanCreated = async (loanData: any) => {
    if (!loanerCar) return;
    
    try {
      const result = await LoanService.createLoan(loanData);
      if (!result || result.errorCode !== ServiceErrorCode.success) {
        if (result?.errorCode === ServiceErrorCode.conflict) {
          ErrorService.errorMessage("Conflit de Dates", "Cette voiture a déjà un prêt sur cette période. Veuillez choisir des dates différentes.");
        } else {
          ErrorService.errorMessage("Erreur", "Impossible de créer le prêt");
        }
        return;
      }

      const today = new Date();
      const startDate = new Date(loanData.startDate);
      const endDate = new Date(loanData.endDate);
      
      if (today >= startDate && today <= endDate) {
        const statusResult = await LoanerCarService.updateLoanerCar(loanerCar.id!, { status: 'EN_PRET' });
        if (statusResult && statusResult.errorCode === ServiceErrorCode.success) {
          setLoanerCar(prev => prev ? { ...prev, status: 'EN_PRET' } : null);
          ErrorService.successMessage("Succès", "Prêt créé et voiture mise en prêt avec succès !");
        }
      } else {
        ErrorService.successMessage("Succès", "Prêt créé avec succès ! La voiture restera disponible jusqu'à la date de début.");
      }

      const loadLoans = async () => {
        try {
          const result = await LoanService.getAllLoans();
          if (result && result.errorCode === ServiceErrorCode.success) {
            const filteredLoans = result.result?.filter(loan => loan.loanerCarId === loanerCar.id) || [];
            setLoans(filteredLoans);
          }
        } catch (error) {
          console.error("Erreur lors du rechargement des prêts:", error);
        }
      };
      loadLoans();
      
    } catch (error) {
      console.error("Erreur lors de la création du prêt:", error);
      ErrorService.errorMessage("Erreur", "Une erreur s'est produite lors de la création du prêt");
    }
  };

  const handleDeleteLoan = async (loanId: number) => {
    const loanToDelete = loans.find(loan => loan.id === loanId);
    if (loanToDelete) {
      setSelectedLoanForDeletion(loanToDelete);
      setIsDeleteLoanDialogOpen(true);
    }
  };

  const confirmDeleteLoan = async () => {
    if (!selectedLoanForDeletion || !loanerCar) return;
    
    try {
      const result = await LoanService.deleteLoan(selectedLoanForDeletion.id!);
      if (!result || result.errorCode !== ServiceErrorCode.success) {
        ErrorService.errorMessage("Erreur", "Impossible de supprimer le prêt");
        return;
      }

      ErrorService.successMessage("Succès", "Prêt supprimé avec succès !");
      
      
      const loadLoans = async () => {
        try {
          const result = await LoanService.getAllLoans();
          if (result && result.errorCode === ServiceErrorCode.success) {
            const filteredLoans = result.result?.filter(loan => loan.loanerCarId === loanerCar.id) || [];
            setLoans(filteredLoans);
          }
        } catch (error) {
          console.error("Erreur lors du rechargement des prêts:", error);
        }
      };
      loadLoans();
      
      
      setIsDeleteLoanDialogOpen(false);
      setSelectedLoanForDeletion(null);
      
    } catch (error) {
      console.error("Erreur lors de la suppression du prêt:", error);
      ErrorService.errorMessage("Erreur", "Une erreur s'est produite lors de la suppression du prêt");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIBLE':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'EN_PRET':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'EN_MAINTENANCE':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
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

  if (!loanerCarId) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <Navbar />
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            <span className="ml-3 text-gray-400">Chargement des paramètres...</span>
          </div>
        </div>
      </AuthGuard>
    );
  }

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
              {/* Bouton Prêter - uniquement si disponible */}
              {loanerCar.status === 'DISPONIBLE' && (
                <Button
                  onClick={() => setIsCreateLoanDialogOpen(true)}
                  className="border-2 border-blue-500/60 text-blue-400 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                >
                  <User className="w-4 h-4 mr-2" />
                  Prêter
                </Button>
              )}

              {/* Bouton Arrêter le prêt - uniquement si en prêt */}
              {loanerCar.status === 'EN_PRET' && (
                <Button
                  onClick={() => handleStatusChange('DISPONIBLE')}
                  className="border-2 border-green-500/60 text-green-400 hover:text-white hover:border-green-400 bg-transparent hover:bg-green-400/10 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-green-400/20 focus:outline-none"
                >
                  <Car className="w-4 h-4 mr-2" />
                  Arrêter le prêt
                </Button>
              )}

              {/* Bouton Fin de maintenance - uniquement si en maintenance */}
              {loanerCar.status === 'EN_MAINTENANCE' && (
                <Button
                  onClick={() => handleStatusChange('DISPONIBLE')}
                  className="border-2 border-green-500/60 text-green-400 hover:text-white hover:border-green-400 bg-transparent hover:bg-green-400/10 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-green-400/20 focus:outline-none"
                >
                  <Car className="w-4 h-4 mr-2" />
                  Fin de maintenance
                </Button>
              )}

              {/* Bouton Mettre en maintenance - si disponible ou en prêt */}
              {(loanerCar.status === 'DISPONIBLE' || loanerCar.status === 'EN_PRET') && (
                <Button
                  onClick={() => handleStatusChange('EN_MAINTENANCE')}
                  className="border-2 border-yellow-500/60 text-yellow-400 hover:text-white hover:border-yellow-400 bg-transparent hover:bg-yellow-400/10 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Mettre en maintenance
                </Button>
              )}

              <Button
                className="border-2 border-orange-500/60 text-orange-400 hover:text-white hover:border-orange-400 bg-transparent hover:bg-orange-400/10 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-orange-400/20 focus:outline-none"
                onClick={() => setIsDeleteLoanerCarDialogOpen(true)}
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
              className="h-full"
            >
              <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center space-x-2">
                    <Car className="w-6 h-6 text-blue-400" />
                    <span>Informations du Véhicule</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6 flex-1">
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
              className="h-full"
            >
              <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center space-x-2">
                    <Calendar className="w-6 h-6 text-green-400" />
                    <span>Prêt en Cours</span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1">
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
                              <div className="max-h-24 overflow-y-auto bg-gray-700/50 rounded p-3 border border-gray-600">
                                <p className="text-gray-300 text-base italic">"{activeLoan.notes}"</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 flex-1 flex flex-col items-center justify-center">
                      <Calendar className="w-12 h-12 text-gray-500 mb-4" />
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
                {/* Interface de filtrage */}
                <div className="mb-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Search className="w-5 h-5 text-blue-400" />
                    <span>Filtres de Recherche</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Filtre par nom du client */}
                    <div className="space-y-2">
                      <Label htmlFor="loanSearchCustomer" className="text-gray-300 text-sm">Nom du client</Label>
                      <Input
                        id="loanSearchCustomer"
                        placeholder="Rechercher par nom..."
                        value={loanSearchCustomer}
                        onChange={(e) => setLoanSearchCustomer(e.target.value)}
                        className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                      />
                    </div>

                    {/* Filtre par date de début */}
                    <div className="space-y-2">
                      <Label htmlFor="loanSearchStartDate" className="text-gray-300 text-sm">Date de début</Label>
                      <Input
                        id="loanSearchStartDate"
                        type="date"
                        value={loanSearchStartDate}
                        onChange={(e) => setLoanSearchStartDate(e.target.value)}
                        className="bg-gray-700/60 border-gray-600 text-white focus:border-blue-400"
                      />
                    </div>

                    {/* Filtre par date de fin */}
                    <div className="space-y-2">
                      <Label htmlFor="loanSearchEndDate" className="text-gray-300 text-sm">Date de fin</Label>
                      <Input
                        id="loanSearchEndDate"
                        type="date"
                        value={loanSearchEndDate}
                        onChange={(e) => setLoanSearchEndDate(e.target.value)}
                        className="bg-gray-700/60 border-gray-600 text-white focus:border-blue-400"
                      />
                    </div>

                    {/* Filtre par numéro OR */}
                    <div className="space-y-2">
                      <Label htmlFor="loanSearchOrNumber" className="text-gray-300 text-sm">Numéro OR</Label>
                      <Input
                        id="loanSearchOrNumber"
                        placeholder="Rechercher par OR..."
                        value={loanSearchOrNumber}
                        onChange={(e) => setLoanSearchOrNumber(e.target.value)}
                        className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                      />
                    </div>
                  </div>

                  {/* Bouton de réinitialisation des filtres */}
                  {(loanSearchCustomer || loanSearchStartDate || loanSearchEndDate || loanSearchOrNumber) && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setLoanSearchCustomer("");
                          setLoanSearchStartDate("");
                          setLoanSearchEndDate("");
                          setLoanSearchOrNumber("");
                        }}
                        className="border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10"
                      >
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  )}
                </div>
                {isLoadingLoans ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
                    <span className="ml-3 text-gray-400">Chargement des prêts...</span>
                  </div>
                ) : filteredLoans.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">
                      {loans.length === 0 ? "Aucun prêt enregistré" : "Aucun prêt ne correspond aux critères de recherche"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {loans.length === 0 
                        ? "Cette voiture n'a pas encore été prêtée"
                        : "Essayez de modifier vos critères de recherche ou réinitialisez les filtres"
                      }
                    </p>
                    {loans.length > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setLoanSearchCustomer("");
                          setLoanSearchStartDate("");
                          setLoanSearchEndDate("");
                          setLoanSearchOrNumber("");
                        }}
                        className="mt-4 border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10"
                      >
                        Réinitialiser les filtres
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentLoans.map((loan) => (
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
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            {loan.notes && (
                              <div className="mt-4 pt-4 border-t border-gray-600">
                                <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-semibold">Notes</div>
                                <div className="max-h-20 overflow-y-auto bg-gray-700/50 rounded p-3 border border-gray-600">
                                  <div className="text-gray-300 text-base italic">
                                    "{loan.notes}"
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => handleDeleteLoan(loan.id!)}
                            className="ml-4 border-2 border-red-500/60 text-red-400 hover:text-white hover:border-red-400 bg-transparent hover:bg-red-400/10 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-red-400/20 focus:outline-none"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination des prêts */}
                {filteredLoans.length > loansPerPage && (
                  <div className="mt-6 flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToFirstLoanPage}
                      disabled={currentLoanPage === 1}
                      className="border-gray-600 text-gray-300 hover:text-white hover:border-purple-400 bg-transparent hover:bg-purple-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Première
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousLoanPage}
                      disabled={currentLoanPage === 1}
                      className="border-gray-600 text-gray-300 hover:text-white hover:border-purple-400 bg-transparent hover:bg-purple-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédente
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalLoanPages }, (_, index) => {
                        const pageNumber = index + 1;
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalLoanPages ||
                          (pageNumber >= currentLoanPage - 2 && pageNumber <= currentLoanPage + 2)
                        ) {
                          return (
                            <Button
                              key={pageNumber}
                              variant={currentLoanPage === pageNumber ? "default" : "outline"}
                              size="sm"
                              onClick={() => goToLoanPage(pageNumber)}
                              className={
                                currentLoanPage === pageNumber
                                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                                  : "border-gray-600 text-gray-300 hover:text-white hover:border-purple-400 bg-transparent hover:bg-purple-400/10"
                              }
                            >
                              {pageNumber}
                            </Button>
                          );
                        } else if (
                          pageNumber === currentLoanPage - 3 ||
                          pageNumber === currentLoanPage + 3
                        ) {
                          return (
                            <span key={pageNumber} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextLoanPage}
                      disabled={currentLoanPage === totalLoanPages}
                      className="border-gray-600 text-gray-300 hover:text-white hover:border-purple-400 bg-transparent hover:bg-purple-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivante
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToLastLoanPage}
                      disabled={currentLoanPage === totalLoanPages}
                      className="border-gray-600 text-gray-300 hover:text-white hover:border-purple-400 bg-transparent hover:bg-purple-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Dernière
                    </Button>
                  </div>
                )}

                {/* Informations sur le filtrage */}
                {loans.length > 0 && (
                  <div className="mt-4 text-center text-sm text-gray-400">
                    Affichage de {startLoanIndex + 1} à {Math.min(endLoanIndex, filteredLoans.length)} sur {filteredLoans.length} prêt{filteredLoans.length > 1 ? 's' : ''} sur {loans.length} au total
                    {filteredLoans.length !== loans.length && (
                      <span className="block mt-1 text-blue-400">
                        Filtré selon vos critères de recherche
                      </span>
                    )}
                    {totalLoanPages > 1 && (
                      <span className="block mt-1 text-purple-400">
                        Page {currentLoanPage} sur {totalLoanPages}
                      </span>
                    )}
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
        <CreateLoanDialog
          isOpen={isCreateLoanDialogOpen}
          onClose={() => setIsCreateLoanDialogOpen(false)}
          loanerCar={loanerCar}
          onLoanCreated={handleLoanCreated}
        />
        <DeleteLoanDialog
          isOpen={isDeleteLoanDialogOpen}
          onClose={() => {
            setIsDeleteLoanDialogOpen(false);
            setSelectedLoanForDeletion(null);
          }}
          onLoanDeleted={confirmDeleteLoan}
          loan={selectedLoanForDeletion}
        />
      </div>
    </AuthGuard>
  )
} 