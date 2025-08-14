"use client"

import { motion } from "framer-motion"
import { Car, Plus, Trash2, Archive, Search, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { AuthGuard } from "@/components/auth-guard"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ErrorService } from "@/services/error.service"
import { ServiceErrorCode } from "@/services/service.result"
import { CreateCarBrandDialog, DeleteCarBrandDialog, CreateRegistrationDialog, DeleteRegistrationDialog,
  CreateCarModelDialog, DeleteCarModelDialog, ArchiveLoanerCarDialog
} from "@/components/dialog"
import { ICarBrand } from "@/models/car-brand.model"
import { ICarModel } from "@/models/car-model.model"
import { IRegistration } from "@/models/registration.model"
import { ILoanerCar } from "@/models/loaner-car.model"
import CarBrandService from "@/services/car-brand.service"
import CarModelService from "@/services/car-model.service"
import RegistrationService from "@/services/registration.service"
import LoanerCarService from "@/services/loaner-car.service"
import LoanService from "@/services/loan.service"

export default function LoanerCarPage() {
  const router = useRouter();
  
  const [brands, setBrands] = useState<ICarBrand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [filteredBrands, setFilteredBrands] = useState<ICarBrand[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  
  const [models, setModels] = useState<ICarModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [filteredModels, setFilteredModels] = useState<ICarModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const [registrations, setRegistrations] = useState<IRegistration[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<string>("");
  const [filteredRegistrations, setFilteredRegistrations] = useState<IRegistration[]>([]);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);

  const [status, setStatus] = useState<string>("DISPONIBLE");

  const [loanerCars, setLoanerCars] = useState<any[]>([]);
  const [filteredLoanerCars, setFilteredLoanerCars] = useState<any[]>([]);
  const [isLoadingLoanerCars, setIsLoadingLoanerCars] = useState(false);

  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  
  const [showCreateForm, setShowCreateForm] = useState(false);

  
  const [isCreateCarBrandDialogOpen, setIsCreateCarBrandDialogOpen] = useState(false);
  const [isDeleteCarBrandDialogOpen, setIsDeleteCarBrandDialogOpen] = useState(false);
  const [isCreateCarModelDialogOpen, setIsCreateCarModelDialogOpen] = useState(false);
  const [isDeleteCarModelDialogOpen, setIsDeleteCarModelDialogOpen] = useState(false);
  const [isCreateRegistrationDialogOpen, setIsCreateRegistrationDialogOpen] = useState(false);
  const [isDeleteRegistrationDialogOpen, setIsDeleteRegistrationDialogOpen] = useState(false);
  const [isDeleteLoanerCarDialogOpen, setIsDeleteLoanerCarDialogOpen] = useState(false);
  const [loanerCarToArchive, setLoanerCarToArchive] = useState<any>(null);

  
  const [brandSearchTerm, setBrandSearchTerm] = useState<string>("");
  const [modelSearchTerm, setModelSearchTerm] = useState<string>("");
  const [registrationSearchTerm, setRegistrationSearchTerm] = useState<string>("");

  
  const [searchStatus, setSearchStatus] = useState<string>("ALL");
  const [searchModel, setSearchModel] = useState<string>("");
  const [searchPlate, setSearchPlate] = useState<string>("");

  
  useEffect(() => {
    const loadBrands = async () => {
      setIsLoadingBrands(true);
      try {
        const result = await CarBrandService.getAllCarBrands();
        if (result && result.errorCode === ServiceErrorCode.success) {
          setBrands(result.result || []);
        } else {
          setBrands([]);
        }
      } catch (error) {
        setBrands([]);
      } finally {
        setIsLoadingBrands(false);
      }
    };

    loadBrands();
  }, []);

  
  useEffect(() => {
    if (selectedBrand && selectedBrand !== "loading" && selectedBrand !== "none") {
      const loadModels = async () => {
        setIsLoadingModels(true);
        try {
          const result = await CarModelService.getCarModelsByBrand(parseInt(selectedBrand));
          if (result && result.errorCode === ServiceErrorCode.success) {
            setModels(result.result || []);
          } else {
            setModels([]);
          }
        } catch (error) {
          setModels([]);
        } finally {
          setIsLoadingModels(false);
        }
      };

      loadModels();
      setSelectedModel("");
    } else {
      setModels([]);
      setSelectedModel("");
    }
  }, [selectedBrand]);

  
  useEffect(() => {
    const loadRegistrations = async () => {
      setIsLoadingRegistrations(true);
      try {
        const result = await RegistrationService.getAllRegistrations();
        if (result && result.errorCode === ServiceErrorCode.success) {
          setRegistrations(result.result || []);
        } else {
          setRegistrations([]);
        }
      } catch (error) {
        setRegistrations([]);
      } finally {
        setIsLoadingRegistrations(false);
      }
    };

    loadRegistrations();
  }, []);

  
  useEffect(() => {
    const loadLoanerCars = async () => {
      setIsLoadingLoanerCars(true);
      try {
        const result = await LoanerCarService.getAllLoanerCars();
        if (result && result.errorCode === ServiceErrorCode.success) {
          setLoanerCars(result.result || []);
          setFilteredLoanerCars(result.result || []); 
        } else {
          setLoanerCars([]);
          setFilteredLoanerCars([]);
        }
      } catch (error) {
        setLoanerCars([]);
        setFilteredLoanerCars([]);
      } finally {
        setIsLoadingLoanerCars(false);
      }
    };

    loadLoanerCars();
  }, []);

  useEffect(() => {
    const verifyLoanerCarStatuses = async () => {
      try {
        const loansResult = await LoanService.getAllLoans();
        if (!loansResult || loansResult.errorCode !== ServiceErrorCode.success) {
          return;
        }

        const allLoans = loansResult.result || [];
        const now = new Date();

        for (const loanerCar of loanerCars) {
          if (loanerCar.status === 'EN_PRET') {
            const hasActiveLoan = allLoans.some(loan => {
              if (loan.loanerCarId === loanerCar.id) {
                const startDate = new Date(loan.startDate);
                const endDate = new Date(loan.endDate);
                return startDate <= now && now <= endDate;
              }
              return false;
            });

            if (!hasActiveLoan) {
              try {
                await LoanerCarService.updateLoanerCar(loanerCar.id!, { status: 'DISPONIBLE' });
                console.log(`Voiture ${loanerCar.id} mise en DISPONIBLE (pas de prêt actif)`);
                
                setLoanerCars(prev => prev.map(car => 
                  car.id === loanerCar.id ? { ...car, status: 'DISPONIBLE' } : car
                ));
                setFilteredLoanerCars(prev => prev.map(car => 
                  car.id === loanerCar.id ? { ...car, status: 'DISPONIBLE' } : car
                ));
              } catch (error) {
                console.error(`Erreur lors de la mise à jour du statut de la voiture ${loanerCar.id}:`, error);
              }
            }
          } else if (loanerCar.status === 'DISPONIBLE') {
            const hasActiveLoan = allLoans.some(loan => {
              if (loan.loanerCarId === loanerCar.id) {
                const startDate = new Date(loan.startDate);
                const endDate = new Date(loan.endDate);
                return startDate <= now && now <= endDate;
              }
              return false;
            });

            if (hasActiveLoan) {
              try {
                await LoanerCarService.updateLoanerCar(loanerCar.id!, { status: 'EN_PRET' });
                console.log(`Voiture ${loanerCar.id} mise en EN_PRET (prêt actif détecté)`);
                
                setLoanerCars(prev => prev.map(car => 
                  car.id === loanerCar.id ? { ...car, status: 'EN_PRET' } : car
                ));
                setFilteredLoanerCars(prev => prev.map(car => 
                  car.id === loanerCar.id ? { ...car, status: 'EN_PRET' } : car
                ));
              } catch (error) {
                console.error(`Erreur lors de la mise à jour du statut de la voiture ${loanerCar.id}:`, error);
              }
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification des statuts des voitures de prêt:", error);
      }
    };

    if (loanerCars.length > 0) {
      verifyLoanerCarStatuses();
    }
  }, [loanerCars]);


  useEffect(() => {
    let filtered = loanerCars;

    
    if (searchStatus !== "ALL") {
      filtered = filtered.filter(car => car.status === searchStatus);
    }

    
    if (searchModel.trim()) {
      filtered = filtered.filter(car => 
        car.model?.modelName?.toLowerCase().includes(searchModel.toLowerCase())
      );
    }

    
    if (searchPlate.trim()) {
      filtered = filtered.filter(car => 
        car.registration?.registrationName?.toLowerCase().includes(searchPlate.toLowerCase())
      );
    }

    
    setCurrentPage(1);
    setFilteredLoanerCars(filtered);
  }, [loanerCars, searchStatus, searchModel, searchPlate]);

  
  useEffect(() => {
    if (brandSearchTerm) {
      const filtered = brands.filter(brand => 
        brand.brandName.toLowerCase().includes(brandSearchTerm.toLowerCase())
      );
      setFilteredBrands(filtered);
    } else {
      setFilteredBrands(brands);
    }
  }, [brandSearchTerm, brands]);

  
  useEffect(() => {
    if (modelSearchTerm) {
      const filtered = models.filter(model => 
        model.modelName.toLowerCase().includes(modelSearchTerm.toLowerCase())
      );
      setFilteredModels(filtered);
    } else {
      setFilteredModels(models);
    }
  }, [modelSearchTerm, models]);

  
  useEffect(() => {
    if (registrationSearchTerm) {
      const filtered = registrations.filter(registration => 
        registration.registrationName.toLowerCase().includes(registrationSearchTerm.toLowerCase())
      );
      setFilteredRegistrations(filtered);
    } else {
      setFilteredRegistrations(registrations);
    }
  }, [registrationSearchTerm, registrations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBrand || !selectedModel || !selectedRegistration || !status) {
      ErrorService.errorMessage("Champs manquants", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const loanerCarData: Omit<ILoanerCar, 'id'> = {
        carBrandId: parseInt(selectedBrand),
        carModelId: parseInt(selectedModel),
        registrationId: parseInt(selectedRegistration),
        status
      };

      console.log("Création de la voiture de prêt:", loanerCarData);
      
      const result = await LoanerCarService.createLoanerCar(loanerCarData);
      if (!result || result.errorCode !== ServiceErrorCode.success) {
        ErrorService.errorMessage("Erreur", "Impossible de créer la voiture de prêt");
        return;
      }

      console.log("Voiture de prêt créée avec succès:", result.result);
      ErrorService.successMessage("Succès", "Voiture de prêt créée avec succès !");
      
      
      setSelectedBrand("");
      setSelectedModel("");
      setSelectedRegistration("");
      setStatus("DISPONIBLE");
      setBrandSearchTerm("");
      setModelSearchTerm("");
      setRegistrationSearchTerm("");
      
      
      setShowCreateForm(false);
      
      
      const loadLoanerCars = async () => {
        try {
          const result = await LoanerCarService.getAllLoanerCars();
          if (result && result.errorCode === ServiceErrorCode.success) {
            setLoanerCars(result.result || []);
            setFilteredLoanerCars(result.result || []); 
          }
        } catch (error) {
          console.error("Erreur lors du rechargement des voitures de prêt:", error);
        }
      };
      loadLoanerCars();
      
    } catch (error) {
      console.error("Erreur lors de la création de la voiture de prêt:", error);
      ErrorService.errorMessage("Erreur", "Une erreur s'est produite lors de la création de la voiture de prêt");
    }
  }

  const handleDeleteLoanerCar = async (id: number) => {
    const loanerCar = loanerCars.find(car => car.id === id);
    if (loanerCar) {
      setLoanerCarToArchive(loanerCar);
      setIsDeleteLoanerCarDialogOpen(true);
    }
  };

  const onLoanerCarArchived = async () => {
    if (!loanerCarToArchive) return;

    try {
      const result = await LoanerCarService.deleteLoanerCar(loanerCarToArchive.id);
      if (!result || result.errorCode !== ServiceErrorCode.success) {
        ErrorService.errorMessage("Erreur", "Impossible d'archiver la voiture de prêt");
        return;
      }

      ErrorService.successMessage("Succès", "Voiture de prêt archivée avec succès !");
      setLoanerCars(loanerCars.filter(car => car.id !== loanerCarToArchive.id));
      setFilteredLoanerCars(filteredLoanerCars.filter(car => car.id !== loanerCarToArchive.id)); 
      setIsDeleteLoanerCarDialogOpen(false);
      setLoanerCarToArchive(null);
    } catch (error) {
      console.error("Erreur lors de l'archivage de la voiture de prêt:", error);
      ErrorService.errorMessage("Erreur", "Une erreur s'est produite lors de l'archivage de la voiture de prêt");
    }
  };

  
  const totalPages = Math.ceil(filteredLoanerCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLoanerCars = filteredLoanerCars.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

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
              <div>
                <h1 className="text-3xl font-bold text-white">Voitures de Prêt</h1>
                <p className="text-gray-400">Gérez votre flotte de voitures de prêt</p>
              </div>
            </div>
            
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              <Car className="w-4 h-4 mr-2" />
              {showCreateForm ? "Masquer le formulaire" : "Créer une voiture de prêt"}
            </Button>
          </motion.div>

          {/* Formulaire */}
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center space-x-2">
                    <Car className="w-6 h-6 text-blue-400" />
                    <span>Détails de la Voiture de Prêt</span>
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Remplissez les informations pour ajouter une nouvelle voiture de prêt
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations véhicule */}
                    <div className="space-y-4">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Marque */}
                        <div className="space-y-2">
                          <Label htmlFor="brand" className="text-gray-300">Marque</Label>
                          <div className="relative">
                            <Input
                              id="brand"
                              placeholder={selectedBrand ? 
                                `${brands.find(b => b.id?.toString() === selectedBrand)?.brandName} (sélectionnée)` : 
                                "Tapez pour rechercher une marque..."
                              }
                              value={selectedBrand ? 
                                brands.find(b => b.id?.toString() === selectedBrand)?.brandName || "" : 
                                brandSearchTerm
                              }
                              onChange={(e) => {
                                const searchValue = e.target.value;
                                setBrandSearchTerm(searchValue);
                                
                                
                                if (searchValue !== brands.find(b => b.id?.toString() === selectedBrand)?.brandName) {
                                  setSelectedBrand("");
                                }
                              }}
                              onFocus={() => {
                                const dropdown = document.getElementById('brandDropdown');
                                if (dropdown) dropdown.classList.remove('hidden');
                              }}
                              className={`bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 ${selectedBrand ? 'border-green-500' : ''}`}
                              required
                            />
                            
                            {/* Liste déroulante des marques */}
                            <div 
                              id="brandDropdown"
                              className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto hidden"
                              onMouseLeave={() => {
                                setTimeout(() => {
                                  const dropdown = document.getElementById('brandDropdown');
                                  if (dropdown) dropdown.classList.add('hidden');
                                }, 100);
                              }}
                            >
                              {isLoadingBrands ? (
                                <div className="px-3 py-2 text-gray-400 text-sm">Chargement des marques...</div>
                              ) : filteredBrands.length === 0 ? (
                                <div className="px-3 py-2 text-gray-400 text-sm">Aucune marque trouvée</div>
                              ) : (
                                filteredBrands.map(brand => (
                                  <div
                                    key={brand.id}
                                    className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                                    onClick={() => {
                                      setSelectedBrand(brand.id?.toString() || "");
                                      setBrandSearchTerm("");
                                      const dropdown = document.getElementById('brandDropdown');
                                      if (dropdown) dropdown.classList.add('hidden');
                                    }}
                                  >
                                    {brand.brandName}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                          
                          {/* Boutons pour gérer les marques */}
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsCreateCarBrandDialogOpen(true)}
                              className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10 flex-1"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Ajouter
                            </Button>
                            
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsDeleteCarBrandDialogOpen(true)}
                              disabled={!selectedBrand}
                              className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-red-400 bg-transparent hover:bg-red-400/10 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </Button>
                          </div>
                        </div>
                        
                        {/* Modèle */}
                        <div className="space-y-2">
                          <Label htmlFor="model" className="text-gray-300">Modèle</Label>
                          <div className="relative">
                            <Input
                              id="model"
                              placeholder={selectedModel ? 
                                `${models.find(m => m.id?.toString() === selectedModel)?.modelName} (sélectionné)` : 
                                "Tapez pour rechercher un modèle..."
                              }
                              value={selectedModel ? 
                                models.find(m => m.id?.toString() === selectedModel)?.modelName || "" : 
                                modelSearchTerm
                              }
                              onChange={(e) => {
                                const searchValue = e.target.value;
                                setModelSearchTerm(searchValue);
                                
                                
                                if (searchValue !== models.find(m => m.id?.toString() === selectedModel)?.modelName) {
                                  setSelectedModel("");
                                }
                              }}
                              onFocus={() => {
                                const dropdown = document.getElementById('modelDropdown');
                                if (dropdown) dropdown.classList.remove('hidden');
                              }}
                              disabled={!selectedBrand}
                              className={`bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 ${selectedModel ? 'border-green-500' : ''} ${!selectedBrand ? 'opacity-50' : ''}`}
                              required
                            />
                            
                            {/* Liste déroulante des modèles */}
                            <div 
                              id="modelDropdown"
                              className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto hidden"
                              onMouseLeave={() => {
                                setTimeout(() => {
                                  const dropdown = document.getElementById('modelDropdown');
                                  if (dropdown) dropdown.classList.add('hidden');
                                }, 100);
                              }}
                            >
                              {isLoadingModels ? (
                                <div className="px-3 py-2 text-gray-400 text-sm">Chargement des modèles...</div>
                              ) : filteredModels.length === 0 ? (
                                <div className="px-3 py-2 text-gray-400 text-sm">Aucun modèle trouvé pour cette marque</div>
                              ) : (
                                filteredModels.map(model => (
                                  <div
                                    key={model.id}
                                    className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                                    onClick={() => {
                                      setSelectedModel(model.id?.toString() || "");
                                      setModelSearchTerm("");
                                      const dropdown = document.getElementById('modelDropdown');
                                      if (dropdown) dropdown.classList.add('hidden');
                                    }}
                                  >
                                    {model.modelName}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                          
                          {/* Boutons pour gérer les modèles */}
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsCreateCarModelDialogOpen(true)}
                              disabled={!selectedBrand}
                              className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Ajouter
                            </Button>
                            
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsDeleteCarModelDialogOpen(true)}
                              disabled={!selectedModel}
                              className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-red-400 bg-transparent hover:bg-red-400/10 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Plaque d'immatriculation */}
                      <div className="space-y-2">
                        <Label htmlFor="registration" className="text-gray-300">Plaque d'immatriculation</Label>
                        <div className="relative">
                          <Input
                            id="registration"
                            placeholder={selectedRegistration ? 
                              `${registrations.find(r => r.id?.toString() === selectedRegistration)?.registrationName} (sélectionnée)` : 
                              "Tapez pour rechercher une plaque..."
                            }
                            value={selectedRegistration ? 
                              registrations.find(r => r.id?.toString() === selectedRegistration)?.registrationName || "" : 
                              registrationSearchTerm
                            }
                            onChange={(e) => {
                              const searchValue = e.target.value;
                              setRegistrationSearchTerm(searchValue);
                              
                              
                              if (searchValue !== registrations.find(r => r.id?.toString() === selectedRegistration)?.registrationName) {
                                setSelectedRegistration("");
                              }
                            }}
                            onFocus={() => {
                              const dropdown = document.getElementById('registrationDropdown');
                              if (dropdown) dropdown.classList.remove('hidden');
                            }}
                            className={`bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 ${selectedRegistration ? 'border-green-500' : ''}`}
                            required
                          />
                          
                          {/* Liste déroulante des plaques */}
                          <div 
                            id="registrationDropdown"
                            className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto hidden"
                            onMouseLeave={() => {
                              setTimeout(() => {
                                const dropdown = document.getElementById('registrationDropdown');
                                if (dropdown) dropdown.classList.add('hidden');
                              }, 100);
                            }}
                          >
                            {isLoadingRegistrations ? (
                              <div className="px-3 py-2 text-gray-400 text-sm">Chargement des plaques...</div>
                            ) : filteredRegistrations.length === 0 ? (
                              <div className="px-3 py-2 text-gray-400 text-sm">Aucune plaque trouvée</div>
                            ) : (
                              filteredRegistrations.map(registration => (
                                <div
                                  key={registration.id}
                                  className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                                  onClick={() => {
                                    setSelectedRegistration(registration.id?.toString() || "");
                                    setRegistrationSearchTerm("");
                                    const dropdown = document.getElementById('registrationDropdown');
                                    if (dropdown) dropdown.classList.add('hidden');
                                  }}
                                >
                                  {registration.registrationName}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      
                        {/* Boutons pour gérer les plaques */}
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsCreateRegistrationDialogOpen(true)}
                            className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10 flex-1"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter
                          </Button>
                          
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteRegistrationDialogOpen(true)}
                            disabled={!selectedRegistration}
                            className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-red-400 bg-transparent hover:bg-red-400/10 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </div>

                      {/* Statut */}
                      <div className="space-y-2">
                        <Label htmlFor="status" className="text-gray-300">Statut</Label>
                        <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger className="bg-gray-700/60 border-gray-600 text-white">
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600 text-white">
                            <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                            <SelectItem value="EN_PRET">En prêt</SelectItem>
                            <SelectItem value="EN_MAINTENANCE">En maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Bouton de soumission */}
                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateForm(false)}
                        className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 bg-transparent hover:bg-gray-400/10"
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                      >
                        Créer la Voiture de Prêt
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Liste des Voitures de Prêt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <Card className="bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center space-x-2">
                  <Car className="w-6 h-6 text-purple-400" />
                  <span>Voitures de Prêt Disponibles</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Liste de toutes les voitures de prêt de votre flotte
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Interface de recherche */}
                <div className="mb-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Search className="w-5 h-5 text-blue-400" />
                    <span>Recherche et Filtres</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Filtre par statut */}
                    <div className="space-y-2">
                      <Label htmlFor="searchStatus" className="text-gray-300 text-sm">Statut</Label>
                      <Select value={searchStatus} onValueChange={setSearchStatus}>
                        <SelectTrigger className="bg-gray-700/60 border-gray-600 text-white">
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600 text-white">
                          <SelectItem value="ALL">Tous les statuts</SelectItem>
                          <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                          <SelectItem value="EN_PRET">En prêt</SelectItem>
                          <SelectItem value="EN_MAINTENANCE">En maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Recherche par modèle */}
                    <div className="space-y-2">
                      <Label htmlFor="searchModel" className="text-gray-300 text-sm">Modèle de voiture</Label>
                      <Input
                        id="searchModel"
                        placeholder="Rechercher par modèle..."
                        value={searchModel}
                        onChange={(e) => setSearchModel(e.target.value)}
                        className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                      />
                    </div>

                    {/* Recherche par plaque */}
                    <div className="space-y-2">
                      <Label htmlFor="searchPlate" className="text-gray-300 text-sm">Plaque d'immatriculation</Label>
                      <Input
                        id="searchPlate"
                        placeholder="Rechercher par plaque..."
                        value={searchPlate}
                        onChange={(e) => setSearchPlate(e.target.value)}
                        className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                      />
                    </div>
                  </div>

                  {/* Bouton de réinitialisation des filtres */}
                  {(searchStatus !== "ALL" || searchModel || searchPlate) && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchStatus("ALL");
                          setSearchModel("");
                          setSearchPlate("");
                        }}
                        className="border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10"
                      >
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  )}
                </div>

                {isLoadingLoanerCars ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                    <span className="ml-3 text-gray-400">Chargement des voitures de prêt...</span>
                  </div>
                ) : filteredLoanerCars.length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                      {loanerCars.length === 0 ? "Aucune voiture de prêt trouvée" : "Aucune voiture de prêt ne correspond aux critères de recherche"}
                    </p>
                    <p className="text-gray-500">
                      {loanerCars.length === 0 
                        ? "Créez votre première voiture de prêt en utilisant le formulaire ci-dessus"
                        : "Essayez de modifier vos critères de recherche ou réinitialisez les filtres"
                      }
                    </p>
                    {loanerCars.length === 0 ? (
                      <Button
                        onClick={() => setShowCreateForm(true)}
                        className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white"
                      >
                        <Car className="w-4 h-4 mr-2" />
                        Créer votre première voiture de prêt
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchStatus("ALL");
                          setSearchModel("");
                          setSearchPlate("");
                        }}
                        className="mt-4 border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10"
                      >
                        Réinitialiser les filtres
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center space-x-2 text-blue-400">
                        <Info className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          💡 Cliquez sur les badges de statut pour voir les détails de la voiture
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentLoanerCars.map((loanerCar) => (
                        <div
                          key={loanerCar.id}
                          className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-purple-400/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white">
                                {loanerCar.brand?.brandName} {loanerCar.model?.modelName}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {loanerCar.registration?.registrationName}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => router.push(`/loanerCar/${loanerCar.id}`)}
                                className={`px-2 py-1 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center space-x-2 group ${
                                  loanerCar.status === 'DISPONIBLE' 
                                    ? 'bg-green-500/20 text-green-400 border-2 border-green-500/40 hover:bg-green-500/30 hover:border-green-500/60 hover:shadow-green-500/25'
                                    : loanerCar.status === 'EN_PRET'
                                    ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500/40 hover:bg-blue-500/30 hover:border-blue-500/60 hover:shadow-blue-500/25'
                                    : 'bg-orange-500/20 text-orange-400 border-2 border-orange-500/40 hover:bg-orange-500/30 hover:border-orange-500/60 hover:shadow-orange-500/25'
                                }`}>
                                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                                <span>
                                  {loanerCar.status === 'DISPONIBLE' && 'Disponible'}
                                  {loanerCar.status === 'EN_PRET' && 'En prêt'}
                                  {loanerCar.status === 'EN_MAINTENANCE' && 'Maintenance'}
                                </span>
                                <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">→</span>
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm mb-4">
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
                          </div>

                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteLoanerCar(loanerCar.id)}
                              className="border-orange-500/30 text-orange-400 hover:text-orange-300 hover:border-orange-400 hover:bg-orange-500/10 transition-all duration-200"
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              Archiver
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Pagination */}
                    {filteredLoanerCars.length > itemsPerPage && (
                      <div className="mt-6 flex items-center justify-center space-x-2">
                        {/* Bouton Première Page */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToFirstPage}
                          disabled={currentPage === 1}
                          className="border-gray-600 text-gray-300 hover:text-white hover:border-purple-400 bg-transparent hover:bg-purple-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Première
                        </Button>
                        
                        {/* Bouton Page Précédente */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToPreviousPage}
                          disabled={currentPage === 1}
                          className="border-gray-600 text-gray-300 hover:text-white hover:border-purple-400 bg-transparent hover:bg-purple-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Précédente
                        </Button>
                        
                        {/* Numéros de Pages */}
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: totalPages }, (_, index) => {
                            const pageNumber = index + 1;
                            
                            if (
                              pageNumber === 1 ||
                              pageNumber === totalPages ||
                              (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                            ) {
                              return (
                                <Button
                                  key={pageNumber}
                                  variant={currentPage === pageNumber ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => goToPage(pageNumber)}
                                  className={
                                    currentPage === pageNumber
                                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                                      : "border-gray-600 text-gray-300 hover:text-white hover:border-purple-400 bg-transparent hover:bg-purple-400/10"
                                  }
                                >
                                  {pageNumber}
                                </Button>
                              );
                            } else if (
                              pageNumber === currentPage - 3 ||
                              pageNumber === currentPage + 3
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
                        
                        {/* Bouton Page Suivante */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                          className="border-gray-600 text-gray-300 hover:text-white hover:border-purple-400 bg-transparent hover:bg-purple-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Suivante
                        </Button>
                        
                        {/* Bouton Dernière Page */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToLastPage}
                          disabled={currentPage === totalPages}
                          className="border-gray-600 text-gray-300 hover:text-white hover:border-purple-400 bg-transparent hover:bg-purple-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Dernière
                        </Button>
                      </div>
                    )}
                    
                    {/* Informations de pagination */}
                    {filteredLoanerCars.length > 0 && (
                      <div className="mt-4 text-center text-sm text-gray-400">
                        Affichage de {startIndex + 1} à {Math.min(endIndex, filteredLoanerCars.length)} sur {filteredLoanerCars.length} voitures de prêt
                        {totalPages > 1 && ` • Page ${currentPage} sur ${totalPages}`}
                        {filteredLoanerCars.length !== loanerCars.length && (
                          <span className="block mt-1 text-orange-400">
                            Filtré sur {loanerCars.length} voitures au total
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </main>

        {/* Dialogues */}
        <CreateCarBrandDialog
          isOpen={isCreateCarBrandDialogOpen}
          onClose={() => setIsCreateCarBrandDialogOpen(false)}
          onCarBrandCreated={() => {
            setIsCreateCarBrandDialogOpen(false);
            
            const loadBrands = async () => {
              try {
                const result = await CarBrandService.getAllCarBrands();
                if (result && result.errorCode === ServiceErrorCode.success) {
                  setBrands(result.result || []);
                }
              } catch (error) {
                console.error("Erreur lors du rechargement des marques:", error);
              }
            };
            loadBrands();
          }}
        />

        <DeleteCarBrandDialog
          isOpen={isDeleteCarBrandDialogOpen}
          onClose={() => setIsDeleteCarBrandDialogOpen(false)}
          carBrand={brands.find(b => b.id?.toString() === selectedBrand) || null}
          onCarBrandDeleted={() => {
            setIsDeleteCarBrandDialogOpen(false);
            setSelectedBrand("");
            setBrandSearchTerm("");
            
            const loadBrands = async () => {
              try {
                const result = await CarBrandService.getAllCarBrands();
                if (result && result.errorCode === ServiceErrorCode.success) {
                  setBrands(result.result || []);
                }
              } catch (error) {
                console.error("Erreur lors du rechargement des marques:", error);
              }
            };
            loadBrands();
          }}
        />

        <CreateCarModelDialog
          isOpen={isCreateCarModelDialogOpen}
          onClose={() => setIsCreateCarModelDialogOpen(false)}
          brandId={selectedBrand ? parseInt(selectedBrand) : 0}
          brandName={brands.find(b => b.id?.toString() === selectedBrand)?.brandName || ""}
          onCarModelCreated={() => {
            setIsCreateCarModelDialogOpen(false);
            
            if (selectedBrand) {
              const loadModels = async () => {
                try {
                  const result = await CarModelService.getCarModelsByBrand(parseInt(selectedBrand));
                  if (result && result.errorCode === ServiceErrorCode.success) {
                    setModels(result.result || []);
                  }
                } catch (error) {
                  console.error("Erreur lors du rechargement des modèles:", error);
                }
              };
              loadModels();
            }
          }}
        />

        <DeleteCarModelDialog
          isOpen={isDeleteCarModelDialogOpen}
          onClose={() => setIsDeleteCarModelDialogOpen(false)}
          carModel={models.find(m => m.id?.toString() === selectedModel) || null}
          onCarModelDeleted={() => {
            setIsDeleteCarModelDialogOpen(false);
            setSelectedModel("");
            setModelSearchTerm("");
            
            if (selectedBrand) {
              const loadModels = async () => {
                try {
                  const result = await CarModelService.getCarModelsByBrand(parseInt(selectedBrand));
                  if (result && result.errorCode === ServiceErrorCode.success) {
                    setModels(result.result || []);
                  }
                } catch (error) {
                  console.error("Erreur lors du rechargement des modèles:", error);
                }
              };
              loadModels();
            }
          }}
        />

        <CreateRegistrationDialog
          isOpen={isCreateRegistrationDialogOpen}
          onClose={() => setIsCreateRegistrationDialogOpen(false)}
          onRegistrationCreated={() => {
            setIsCreateRegistrationDialogOpen(false);
            
            const loadRegistrations = async () => {
              try {
                const result = await RegistrationService.getAllRegistrations();
                if (result && result.errorCode === ServiceErrorCode.success) {
                  setRegistrations(result.result || []);
                }
              } catch (error) {
                console.error("Erreur lors du rechargement des plaques:", error);
              }
            };
            loadRegistrations();
          }}
        />

        <DeleteRegistrationDialog
          isOpen={isDeleteRegistrationDialogOpen}
          onClose={() => setIsDeleteRegistrationDialogOpen(false)}
          registration={registrations.find(r => r.id?.toString() === selectedRegistration) || null}
          onRegistrationDeleted={() => {
            setIsDeleteRegistrationDialogOpen(false);
            setSelectedRegistration("");
            setRegistrationSearchTerm("");
            
            const loadRegistrations = async () => {
              try {
                const result = await RegistrationService.getAllRegistrations();
                if (result && result.errorCode === ServiceErrorCode.success) {
                  setRegistrations(result.result || []);
                }
              } catch (error) {
                console.error("Erreur lors du rechargement des plaques:", error);
              }
            };
            loadRegistrations();
          }}
        />

        <ArchiveLoanerCarDialog
          isOpen={isDeleteLoanerCarDialogOpen}
          onClose={() => {
            setIsDeleteLoanerCarDialogOpen(false);
            setLoanerCarToArchive(null);
          }}
          onLoanerCarArchived={onLoanerCarArchived}
          loanerCar={loanerCarToArchive}
        />
      </div>
    </AuthGuard>
  )
} 