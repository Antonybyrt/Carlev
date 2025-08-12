"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Package, Car, User, CreditCard, FileText, Trash2, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { AuthGuard } from "@/components/auth-guard"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import LoginService from "@/services/login.service"
import { ILogin } from "@/models/login.model"
import { ErrorService } from "@/services/error.service"
import { ServiceErrorCode } from "@/services/service.result"
import CustomerService from "@/services/customer.service"
import { ICustomer } from "@/models/customer.model"
import { CreateCustomerDialog, DeleteCustomerDialog } from "@/components/dialog"
import { CreateCarBrandDialog, DeleteCarBrandDialog } from "@/components/dialog"
import { CreateCarModelDialog, DeleteCarModelDialog } from "@/components/dialog"
import { CreateSupplierDialog, DeleteSupplierDialog } from "@/components/dialog"
import { CreateRegistrationDialog, DeleteRegistrationDialog } from "@/components/dialog"
import { CreateItemDialog, DeleteItemDialog } from "@/components/dialog"
import { ICarBrand } from "@/models/car-brand.model"
import { ICarModel } from "@/models/car-model.model"
import CarBrandService from "@/services/car-brand.service"
import CarModelService from "@/services/car-model.service"
import { ISupplier } from "@/models/supplier.model"
import SupplierService from "@/services/supplier.service"
import { IRegistration } from "@/models/registration.model"
import RegistrationService from "@/services/registration.service"
import { IItem } from "@/models/item.model"
import ItemService from "@/services/item.service"
import { IOrderDetail } from "@/models/order-detail.model"
import OrderService from "@/services/order.service"
import OrderDetailService from "@/services/order-detail.service"
import { IOrderResponse } from "@/models/order.model";

export default function NewOrderPage() {
  const router = useRouter();
  const [logins, setLogins] = useState<ILogin[]>([]);
  const [selectedLogin, setSelectedLogin] = useState<string>("");
  const [isLoadingLogins, setIsLoadingLogins] = useState(true);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState<string>("");
  const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>([]);
  const [isCreateCustomerDialogOpen, setIsCreateCustomerDialogOpen] = useState(false);
  const [isDeleteCustomerDialogOpen, setIsDeleteCustomerDialogOpen] = useState(false);
  
  // États pour les modales de marques
  const [isCreateCarBrandDialogOpen, setIsCreateCarBrandDialogOpen] = useState(false);
  const [isDeleteCarBrandDialogOpen, setIsDeleteCarBrandDialogOpen] = useState(false);
  
  // États pour les modales de modèles
  const [isCreateCarModelDialogOpen, setIsCreateCarModelDialogOpen] = useState(false);
  const [isDeleteCarModelDialogOpen, setIsDeleteCarModelDialogOpen] = useState(false);
  
  // États pour les modales de fournisseurs
  const [isCreateSupplierDialogOpen, setIsCreateSupplierDialogOpen] = useState(false);
  const [isDeleteSupplierDialogOpen, setIsDeleteSupplierDialogOpen] = useState(false);
  
  // États pour les modales de plaques d'immatriculation
  const [isCreateRegistrationDialogOpen, setIsCreateRegistrationDialogOpen] = useState(false);
  const [isDeleteRegistrationDialogOpen, setIsDeleteRegistrationDialogOpen] = useState(false);
  
  // États pour les modales de pièces
  const [isCreateItemDialogOpen, setIsCreateItemDialogOpen] = useState(false);
  const [isDeleteItemDialogOpen, setIsDeleteItemDialogOpen] = useState(false);
  
  // États pour les marques et modèles
  const [brands, setBrands] = useState<ICarBrand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [filteredBrands, setFilteredBrands] = useState<ICarBrand[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  
  const [models, setModels] = useState<ICarModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [filteredModels, setFilteredModels] = useState<ICarModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // États pour les fournisseurs
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  
  // États pour les plaques d'immatriculation
  const [registrations, setRegistrations] = useState<IRegistration[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<string>("");
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);

  // États pour les pièces
  const [items, setItems] = useState<IItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  
  // États pour les pièces sélectionnées avec quantités
  const [selectedItems, setSelectedItems] = useState<Array<{ itemId: string; quantity: number; searchTerm: string }>>([]);

  // États pour la recherche de compte
  const [loginSearchTerm, setLoginSearchTerm] = useState<string>("");
  const [filteredLogins, setFilteredLogins] = useState<ILogin[]>([]);

  useEffect(() => {
    const loadLogins = async () => {
      try {
        const result = await LoginService.getAllLogins();
        if (result && result.errorCode === ServiceErrorCode.success) {
          setLogins(result.result || []);
          setFilteredLogins(result.result || []);
          console.log("Logins récupérés:", result.result);
        } else {
          setLogins([]);
          setFilteredLogins([]);
          ErrorService.errorMessage("Erreur", "Impossible de récupérer les comptes de connexion");
        }
      } catch (error) {
        console.error("Exception lors de la récupération des logins:", error);
        ErrorService.errorMessage("Erreur", "Impossible de récupérer les comptes de connexion");
        setLogins([]);
        setFilteredLogins([]);
      } finally {
        setIsLoadingLogins(false);
      }
    };

    loadLogins();
  }, []);

  // Filtrer les comptes selon le terme de recherche
  useEffect(() => {
    if (loginSearchTerm.trim() === "") {
      setFilteredLogins(logins);
    } else {
      const filtered = logins.filter(login => 
        login.loginName.toLowerCase().includes(loginSearchTerm.toLowerCase())
      );
      setFilteredLogins(filtered);
    }
  }, [loginSearchTerm, logins]);

  // Charger les clients quand un login est sélectionné
  useEffect(() => {
    if (selectedLogin && selectedLogin !== "loading" && selectedLogin !== "none") {
      const loadCustomers = async () => {
        setIsLoadingCustomers(true);
        try {
          const customersData = await CustomerService.getCustomersByLogin(parseInt(selectedLogin));
          if (customersData && customersData.errorCode === ServiceErrorCode.success) {
            setCustomers(customersData.result || []);
            setFilteredCustomers(customersData.result || []);
          } else {
            setCustomers([]);
            setFilteredCustomers([]);
            ErrorService.errorMessage("Erreur", "Impossible de récupérer les clients");
          }
        } catch (error) {
          setCustomers([]);
          setFilteredCustomers([]);
          ErrorService.errorMessage("Erreur", "Impossible de récupérer les clients");
        } finally {
          setIsLoadingCustomers(false);
        }
      };

      loadCustomers();
      setSelectedCustomer("");
      setCustomerSearchTerm("");
      setLoginSearchTerm("");
    } else {
      setCustomers([]);
      setFilteredCustomers([]);
      setSelectedCustomer("");
      setCustomerSearchTerm("");
      setLoginSearchTerm("");
    }
  }, [selectedLogin]);

  // Filtrer les clients selon le terme de recherche
  useEffect(() => {
    if (customerSearchTerm.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer => 
        customer.firstName.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(customerSearchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [customerSearchTerm, customers]);

  // Charger les marques au chargement de la page
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

  // Charger les modèles quand une marque est sélectionnée
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
      setSelectedModel(""); // Réinitialiser la sélection du modèle
    } else {
      setModels([]);
      setSelectedModel("");
    }
  }, [selectedBrand]);

  // Charger les fournisseurs au chargement de la page
  useEffect(() => {
    const loadSuppliers = async () => {
      setIsLoadingSuppliers(true);
      try {
        const result = await SupplierService.getAllSuppliers();
        if (result && result.errorCode === ServiceErrorCode.success) {
          setSuppliers(result.result || []);
        } else {
          setSuppliers([]);
        }
      } catch (error) {
        setSuppliers([]);
      } finally {
        setIsLoadingSuppliers(false);
      }
    };

    loadSuppliers();
  }, []);

  // Charger les plaques d'immatriculation au chargement de la page
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

  // Charger les pièces au chargement de la page
  useEffect(() => {
    const loadItems = async () => {
      setIsLoadingItems(true);
      try {
        const result = await ItemService.getAllItems();
        if (result && result.errorCode === ServiceErrorCode.success) {
          setItems(result.result || []);
          // setFilteredItems(result.result || []); // This line is removed
        } else {
          setItems([]);
          // setFilteredItems([]); // This line is removed
        }
      } catch (error) {
        setItems([]);
        // setFilteredItems([]); // This line is removed
      } finally {
        setIsLoadingItems(false);
      }
    };

    loadItems();
    
    // Initialiser avec un champ vide pour les pièces
    setSelectedItems([{ itemId: "", quantity: 1, searchTerm: "" }]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    

    
    // Vérifier que toutes les pièces ont un itemId
    const invalidItems = selectedItems.filter(item => !item.itemId);
    if (invalidItems.length > 0) {
      ErrorService.errorMessage("Sélection requise", "Veuillez sélectionner une pièce pour tous les champs");
      return;
    }

    try {
      // Étape 1 : Créer la commande principale
      const orderData = {
        creationDate: new Date(),
        customerId: parseInt(selectedCustomer),
        carBrandId: parseInt(selectedBrand),
        carModelId: parseInt(selectedModel),
        supplierId: parseInt(selectedSupplier),
        loginId: parseInt(selectedLogin),
        registrationId: parseInt(selectedRegistration)
      };

      console.log("Création de la commande:", orderData);
      
      const orderResult = await OrderService.createOrder(orderData);
      if (!orderResult || orderResult.errorCode !== ServiceErrorCode.success) {
        ErrorService.errorMessage("Erreur", "Impossible de créer la commande");
        return;
      }

      const createdOrder = orderResult.result;
      console.log('zzzzz', createdOrder)
      if (!createdOrder?.newOrder?.id) {
        ErrorService.errorMessage("Erreur", "ID de commande manquant après création");
        return;
      }

      const orderId = createdOrder.newOrder.id;
      console.log("Commande créée avec l'ID:", orderId);

      // Étape 2 : Créer les détails de commande pour chaque pièce
      const orderDetailsPromises = selectedItems.map(async (selectedItem) => {
        const orderDetail: IOrderDetail = {
          itemId: parseInt(selectedItem.itemId),
          quantity: selectedItem.quantity,
          orderId: orderId
        };

        console.log("Création du détail de commande:", orderDetail);
        
        const detailResult = await OrderDetailService.createOrderDetail(orderDetail);
        if (!detailResult || detailResult.errorCode !== ServiceErrorCode.success) {
          throw new Error(`Impossible de créer le détail pour la pièce ${selectedItem.itemId}`);
        }
        
        return detailResult.result;
      });

      await Promise.all(orderDetailsPromises);
      
      console.log("Tous les détails de commande ont été créés avec succès");
      ErrorService.successMessage("Succès", "Commande créée avec succès !");
      
      // Rediriger vers la page des commandes
      router.push("/myOrders");
      
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      ErrorService.errorMessage("Erreur", "Une erreur s'est produite lors de la création de la commande");
    }
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
                  {/* Sélecteur de compte de connexion et Informations Client */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Compte de connexion */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <User className="w-5 h-5 text-blue-400" />
                        <span>Compte</span>
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="loginSelect" className="text-gray-300">Sélectionner un compte</Label>
                          <div className="relative">
                            <Input
                              id="loginSelect"
                              placeholder={selectedLogin ? 
                                `${logins.find(l => l.id?.toString() === selectedLogin)?.loginName} (sélectionné)` : 
                                "Tapez pour rechercher un compte..."
                              }
                              value={loginSearchTerm}
                              onChange={(e) => {
                                setLoginSearchTerm(e.target.value);
                                if (selectedLogin) {
                                  setSelectedLogin("");
                                }
                              }}
                              onFocus={() => {
                                // Afficher la liste déroulante
                                const dropdown = document.getElementById('loginDropdown');
                                if (dropdown) dropdown.classList.remove('hidden');
                              }}
                              className={`bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 ${selectedLogin ? 'border-green-500' : ''}`}
                            />
                            
                            {/* Liste déroulante des comptes */}
                            <div 
                              id="loginDropdown"
                              className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto hidden"
                              onMouseLeave={() => {
                                // Cacher la liste quand la souris quitte
                                setTimeout(() => {
                                  const dropdown = document.getElementById('loginDropdown');
                                  if (dropdown) dropdown.classList.add('hidden');
                                }, 100);
                              }}
                            >
                              {isLoadingLogins ? (
                                <div className="px-3 py-2 text-gray-400 text-sm">Chargement des comptes...</div>
                              ) : filteredLogins.length === 0 ? (
                                <div className="px-3 py-2 text-gray-400 text-sm">Aucun compte de connexion trouvé</div>
                              ) : (
                                filteredLogins.map(login => (
                                  <div
                                    key={login.id}
                                    className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                                    onClick={() => {
                                      setSelectedLogin(login.id?.toString() || "");
                                      setLoginSearchTerm("");
                                      const dropdown = document.getElementById('loginDropdown');
                                      if (dropdown) dropdown.classList.add('hidden');
                                    }}
                                  >
                                    {login.loginName}
                                  </div>
                                ))
                              )}
                            </div>
                            
                            {/* Informations sur le nombre de comptes */}
                            {isLoadingLogins && (
                              <div className="mt-2 text-gray-400 text-sm">Chargement des comptes</div>
                            )}
                            
                            {!isLoadingLogins && logins.length > 0 && (
                              <div className="mt-2 text-gray-400 text-sm">
                                {logins.length} compte(s) disponible(s)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Informations Client */}
                    <div className={`space-y-4 ${!selectedLogin || selectedLogin === "loading" || selectedLogin === "none" ? 'opacity-50 pointer-events-none' : ''}`}>
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <User className="w-5 h-5 text-blue-400" />
                        <span>Informations Client</span>
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="customerSelect" className="text-gray-300">Sélectionner un client</Label>
                          <div className="relative">
                            <Input
                              id="customerSelect"
                              placeholder={selectedCustomer ? 
                                `${customers.find(c => c.id?.toString() === selectedCustomer)?.firstName} ${customers.find(c => c.id?.toString() === selectedCustomer)?.lastName} (sélectionné)` : 
                                "Tapez pour rechercher un client..."
                              }
                              value={customerSearchTerm}
                              onChange={(e) => {
                                setCustomerSearchTerm(e.target.value);
                                if (selectedCustomer) {
                                  setSelectedCustomer("");
                                }
                              }}
                              onFocus={() => {
                                // Afficher la liste déroulante
                                const dropdown = document.getElementById('customerDropdown');
                                if (dropdown) dropdown.classList.remove('hidden');
                              }}
                              className={`bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 ${selectedCustomer ? 'border-green-500' : ''}`}
                            />
                            
                            {/* Liste déroulante des clients */}
                            <div 
                              id="customerDropdown"
                              className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto hidden"
                              onMouseLeave={() => {
                                // Cacher la liste quand la souris quitte
                                setTimeout(() => {
                                  const dropdown = document.getElementById('customerDropdown');
                                  if (dropdown) dropdown.classList.add('hidden');
                                }, 100);
                              }}
                            >
                              {isLoadingCustomers ? (
                                <div className="px-3 py-2 text-gray-400 text-sm">Chargement des clients...</div>
                              ) : filteredCustomers.length === 0 ? (
                                <div className="px-3 py-2 text-gray-400 text-sm">Aucun client trouvé pour ce compte</div>
                              ) : (
                                filteredCustomers.map(customer => (
                                  <div
                                    key={customer.id}
                                    className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                                    onClick={() => {
                                      setSelectedCustomer(customer.id?.toString() || "");
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
                        
                        {/* Boutons pour gérer les clients */}
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsCreateCustomerDialogOpen(true)}
                            disabled={!selectedLogin || selectedLogin === "loading" || selectedLogin === "none"}
                            className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Ajouter
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteCustomerDialogOpen(true)}
                            disabled={!selectedCustomer || selectedCustomer === "loading" || selectedCustomer === "none"}
                            className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-red-400 bg-transparent hover:bg-red-400/10 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>

                  {/* Informations véhicule */}
                  <div className={`space-y-4 ${!selectedLogin || selectedLogin === "loading" || selectedLogin === "none" ? 'opacity-50 pointer-events-none' : ''}`}>
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <Car className="w-5 h-5 text-blue-400" />
                      <span>Véhicule</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="brand" className="text-gray-300">Marque</Label>
                        <div className="relative">
                          <Input
                            id="brand"
                            placeholder={selectedBrand ? 
                              `${brands.find(b => b.id?.toString() === selectedBrand)?.brandName} (sélectionnée)` : 
                              "Tapez pour rechercher une marque..."
                            }
                            value={selectedBrand ? brands.find(b => b.id?.toString() === selectedBrand)?.brandName || "" : ""}
                            onChange={(e) => {
                              // Permettre la modification du texte pour la recherche
                              const searchValue = e.target.value;
                              if (searchValue === "") {
                                setSelectedBrand("");
                              } else {
                                // Filtrer les marques selon la recherche
                                const filtered = brands.filter(brand => 
                                  brand.brandName.toLowerCase().includes(searchValue.toLowerCase())
                                );
                                if (filtered.length === 1 && filtered[0].brandName.toLowerCase() === searchValue.toLowerCase()) {
                                  setSelectedBrand(filtered[0].id?.toString() || "");
                                } else {
                                  setSelectedBrand("");
                                }
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
                            ) : brands.length === 0 ? (
                              <div className="px-3 py-2 text-gray-400 text-sm">Aucune marque trouvée</div>
                            ) : (
                              brands.map(brand => (
                                <div
                                  key={brand.id}
                                  className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                                  onClick={() => {
                                    setSelectedBrand(brand.id?.toString() || "");
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
                            <Car className="w-4 h-4 mr-2" />
                            Ajouter
                          </Button>
                          
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteCarBrandDialogOpen(true)}
                            disabled={!selectedBrand || selectedBrand === "loading" || selectedBrand === "none"}
                            className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-red-400 bg-transparent hover:bg-red-400/10 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="model" className="text-gray-300">Modèle</Label>
                        <div className="relative">
                          <Input
                            id="model"
                            placeholder={selectedModel ? 
                              `${models.find(m => m.id?.toString() === selectedModel)?.modelName} (sélectionné)` : 
                              "Tapez pour rechercher un modèle..."
                            }
                            value={selectedModel ? models.find(m => m.id?.toString() === selectedModel)?.modelName || "" : ""}
                            onChange={(e) => {
                              // Permettre la modification du texte pour la recherche
                              const searchValue = e.target.value;
                              if (searchValue === "") {
                                setSelectedModel("");
                              } else {
                                // Filtrer les modèles selon la recherche
                                const filtered = models.filter(model => 
                                  model.modelName.toLowerCase().includes(searchValue.toLowerCase())
                                );
                                if (filtered.length === 1 && filtered[0].modelName.toLowerCase() === searchValue.toLowerCase()) {
                                  setSelectedModel(filtered[0].id?.toString() || "");
                                } else {
                                  setSelectedModel("");
                                }
                              }
                            }}
                            onFocus={() => {
                              const dropdown = document.getElementById('modelDropdown');
                              if (dropdown) dropdown.classList.remove('hidden');
                            }}
                            className={`bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 ${selectedModel ? 'border-green-500' : ''}`}
                            required
                            disabled={!selectedBrand || selectedBrand === "loading" || selectedBrand === "none"}
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
                            ) : models.length === 0 ? (
                              <div className="px-3 py-2 text-gray-400 text-sm">Aucun modèle trouvé pour cette marque</div>
                            ) : (
                              models.map(model => (
                                <div
                                  key={model.id}
                                  className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                                  onClick={() => {
                                    setSelectedModel(model.id?.toString() || "");
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
                            disabled={!selectedBrand || selectedBrand === "loading" || selectedBrand === "none"}
                            className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                          >
                            <Car className="w-4 h-4 mr-2" />
                            Ajouter
                          </Button>
                          
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteCarModelDialogOpen(true)}
                            disabled={!selectedModel || selectedModel === "loading" || selectedModel === "none"}
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
                          value={selectedRegistration ? registrations.find(r => r.id?.toString() === selectedRegistration)?.registrationName || "" : ""}
                          onChange={(e) => {
                            // Permettre la modification du texte pour la recherche
                            const searchValue = e.target.value;
                            if (searchValue === "") {
                              setSelectedRegistration("");
                            } else {
                              // Recherche en temps réel
                              const filtered = registrations.filter(registration => 
                                registration.registrationName.toLowerCase().includes(searchValue.toLowerCase())
                              );
                              if (filtered.length === 1 && filtered[0].registrationName.toLowerCase() === searchValue.toLowerCase()) {
                                setSelectedRegistration(filtered[0].id?.toString() || "");
                              } else {
                                setSelectedRegistration("");
                              }
                            }
                          }}
                          onFocus={() => {
                            const dropdown = document.getElementById('registrationDropdown');
                            if (dropdown) dropdown.classList.remove('hidden');
                          }}
                          className={`bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 ${selectedRegistration ? 'border-green-500' : ''}`}
                          required
                        />
                        
                        {/* Liste déroulante des plaques d'immatriculation */}
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
                          ) : registrations.length === 0 ? (
                            <div className="px-3 py-2 text-gray-400 text-sm">Aucune plaque trouvée</div>
                          ) : (
                            registrations.map(registration => (
                              <div
                                key={registration.id}
                                className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                                onClick={() => {
                                  setSelectedRegistration(registration.id?.toString() || "");
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
                      
                      {/* Boutons pour gérer les plaques d'immatriculation */}
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateRegistrationDialogOpen(true)}
                          className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10 flex-1"
                        >
                          <Car className="w-4 h-4 mr-2" />
                          Ajouter
                        </Button>
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDeleteRegistrationDialogOpen(true)}
                          disabled={!selectedRegistration || selectedRegistration === "loading" || selectedRegistration === "none"}
                          className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-red-400 bg-transparent hover:bg-red-400/10 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Détails de la commande */}
                  <div className={`space-y-4 ${!selectedLogin || selectedLogin === "loading" || selectedLogin === "none" ? 'opacity-50 pointer-events-none' : ''}`}>
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span>Détails de la Commande</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="orderDate" className="text-gray-300">Date de la commande</Label>
                          <Input
                            id="orderDate"
                            type="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="supplier" className="text-gray-300">Fournisseur</Label>
                          <div className="relative">
                            <Input
                              id="supplier"
                              placeholder={selectedSupplier ? 
                                `${suppliers.find(s => s.id?.toString() === selectedSupplier)?.supplierName} (sélectionné)` : 
                                "Tapez pour rechercher un fournisseur..."
                              }
                              value={selectedSupplier ? suppliers.find(s => s.id?.toString() === selectedSupplier)?.supplierName || "" : ""}
                              onChange={(e) => {
                                // Permettre la modification du texte pour la recherche
                                const searchValue = e.target.value;
                                if (searchValue === "") {
                                  setSelectedSupplier("");
                                } else {
                                  // Recherche en temps réel
                                  const filtered = suppliers.filter(supplier => 
                                    supplier.supplierName.toLowerCase().includes(searchValue.toLowerCase())
                                  );
                                  if (filtered.length === 1 && filtered[0].supplierName.toLowerCase() === searchValue.toLowerCase()) {
                                    setSelectedSupplier(filtered[0].id?.toString() || "");
                                  } else {
                                    setSelectedSupplier("");
                                  }
                                }
                              }}
                              onFocus={() => {
                                const dropdown = document.getElementById('supplierDropdown');
                                if (dropdown) dropdown.classList.remove('hidden');
                              }}
                              className={`bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 ${selectedSupplier ? 'border-green-500' : ''}`}
                              required
                            />
                            
                            {/* Liste déroulante des fournisseurs */}
                            <div 
                              id="supplierDropdown"
                              className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto hidden"
                              onMouseLeave={() => {
                                setTimeout(() => {
                                  const dropdown = document.getElementById('supplierDropdown');
                                  if (dropdown) dropdown.classList.add('hidden');
                                }, 100);
                              }}
                            >
                              {isLoadingSuppliers ? (
                                <div className="px-3 py-2 text-gray-400 text-sm">Chargement des fournisseurs...</div>
                              ) : suppliers.length === 0 ? (
                                <div className="px-3 py-2 text-gray-400 text-sm">Aucun fournisseur trouvé</div>
                              ) : (
                                suppliers.map(supplier => (
                                  <div
                                    key={supplier.id}
                                    className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                                    onClick={() => {
                                      setSelectedSupplier(supplier.id?.toString() || "");
                                      const dropdown = document.getElementById('supplierDropdown');
                                      if (dropdown) dropdown.classList.add('hidden');
                                    }}
                                  >
                                    {supplier.supplierName}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                          
                          {/* Boutons pour gérer les fournisseurs */}
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsCreateSupplierDialogOpen(true)}
                              className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10 flex-1"
                            >
                              <Truck className="w-4 h-4 mr-2" />
                              Ajouter
                            </Button>
                            
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsDeleteSupplierDialogOpen(true)}
                              disabled={!selectedSupplier || selectedSupplier === "loading" || selectedSupplier === "none"}
                              className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-red-400 bg-transparent hover:bg-red-400/10 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <Label className="text-gray-300">Pièces demandées</Label>
                        
                        {/* Liste des pièces sélectionnées */}
                        {selectedItems.map((selectedItem, index) => (
                          <div key={index} className="flex space-x-3 items-end">
                            <div className="flex-1 space-y-2">
                              <Label className="text-gray-300 text-sm">Pièce {index + 1}</Label>
                              <div className="relative">
                                <Input
                                  placeholder="Tapez pour rechercher une pièce..."
                                  value={selectedItem.searchTerm}
                                  onChange={(e) => {
                                    const newSelectedItems = [...selectedItems];
                                    newSelectedItems[index].searchTerm = e.target.value;
                                    setSelectedItems(newSelectedItems);
                                  }}
                                  onFocus={() => {
                                    const dropdown = document.getElementById(`itemDropdown${index}`);
                                    if (dropdown) dropdown.classList.remove('hidden');
                                  }}
                                  className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                                />
                                
                                {/* Dropdown des pièces */}
                                <div 
                                  id={`itemDropdown${index}`}
                                  className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto hidden"
                                  onMouseLeave={() => {
                                    setTimeout(() => {
                                      const dropdown = document.getElementById(`itemDropdown${index}`);
                                      if (dropdown) dropdown.classList.add('hidden');
                                    }, 100);
                                  }}
                                >
                                  {isLoadingItems ? (
                                    <div className="px-3 py-2 text-gray-400 text-sm">Chargement des pièces...</div>
                                  ) : (() => {
                                    // Filtrer les pièces selon le terme de recherche de ce champ spécifique
                                    const searchTerm = selectedItem.searchTerm.trim();
                                    if (searchTerm === "") {
                                      return items.map(item => (
                                        <div
                                          key={item.id}
                                          className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                                          onClick={() => {
                                            const newSelectedItems = [...selectedItems];
                                            newSelectedItems[index].itemId = item.id?.toString() || "";
                                            newSelectedItems[index].searchTerm = item.itemName;
                                            setSelectedItems(newSelectedItems);
                                            const dropdown = document.getElementById(`itemDropdown${index}`);
                                            if (dropdown) dropdown.classList.add('hidden');
                                          }}
                                        >
                                          {item.itemName}
                                        </div>
                                      ));
                                    } else {
                                      const filtered = items.filter(item => 
                                        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
                                      );
                                      if (filtered.length === 0) {
                                        return <div className="px-3 py-2 text-gray-400 text-sm">Aucune pièce trouvée</div>;
                                      }
                                      return filtered.map(item => (
                                        <div
                                          key={item.id}
                                          className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                                          onClick={() => {
                                            const newSelectedItems = [...selectedItems];
                                            newSelectedItems[index].itemId = item.id?.toString() || "";
                                            newSelectedItems[index].searchTerm = item.itemName;
                                            setSelectedItems(newSelectedItems);
                                            const dropdown = document.getElementById(`itemDropdown${index}`);
                                            if (dropdown) dropdown.classList.add('hidden');
                                          }}
                                        >
                                          {item.itemName}
                                        </div>
                                      ));
                                    }
                                  })()}
                                </div>
                              </div>
                            </div>
                            
                            <div className="w-24 space-y-2">
                              <Label className="text-gray-300 text-sm">Quantité</Label>
                              <Input
                                type="number"
                                min="1"
                                value={selectedItem.quantity}
                                onChange={(e) => {
                                  const newSelectedItems = [...selectedItems];
                                  newSelectedItems[index].quantity = parseInt(e.target.value) || 1;
                                  setSelectedItems(newSelectedItems);
                                }}
                                className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                              />
                            </div>
                            
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const newSelectedItems = selectedItems.filter((_, i) => i !== index);
                                setSelectedItems(newSelectedItems);
                              }}
                              className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-red-400 bg-transparent hover:bg-red-400/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        
                        {/* Boutons pour gérer les pièces */}
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsCreateItemDialogOpen(true)}
                            className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-blue-400 bg-transparent hover:bg-blue-400/10 flex-1"
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Ajouter
                          </Button>
                          
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteItemDialogOpen(true)}
                            className="text-sm border-gray-600 text-gray-300 hover:text-white hover:border-red-400 bg-transparent hover:bg-red-400/10 flex-1"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                        
                        {/* Bouton pour ajouter un nouveau champ pièce */}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setSelectedItems([...selectedItems, { itemId: "", quantity: 1, searchTerm: "" }]);
                          }}
                          className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-green-400 bg-transparent hover:bg-green-400/10"
                        >
                          + Ajouter un champ
                        </Button>
                      </div>
                      
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className={`flex flex-col sm:flex-row gap-4 pt-4 ${!selectedLogin || selectedLogin === "loading" || selectedLogin === "none" ? 'opacity-50 pointer-events-none' : ''}`}>
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
      <CreateCustomerDialog
        isOpen={isCreateCustomerDialogOpen}
        onClose={() => setIsCreateCustomerDialogOpen(false)}
        onCustomerCreated={() => {
          if (selectedLogin && selectedLogin !== "loading" && selectedLogin !== "none") {
            const loadCustomers = async () => {
              setIsLoadingCustomers(true);
              try {
                const customersData = await CustomerService.getCustomersByLogin(parseInt(selectedLogin));
                if (customersData && customersData.errorCode === ServiceErrorCode.success) {
                  setCustomers(customersData.result || []);
                  setFilteredCustomers(customersData.result || []);
                }
              } catch (error) {
                console.error("Erreur lors du rechargement des clients:", error);
              } finally {
                setIsLoadingCustomers(false);
              }
            };
            loadCustomers();
          }
        }}
        loginId={parseInt(selectedLogin)}
      />
      <DeleteCustomerDialog
        isOpen={isDeleteCustomerDialogOpen}
        onClose={() => setIsDeleteCustomerDialogOpen(false)}
        onCustomerDeleted={() => {
          if (selectedLogin && selectedLogin !== "loading" && selectedLogin !== "none") {
            const loadCustomers = async () => {
              setIsLoadingCustomers(true);
              try {
                const customersData = await CustomerService.getCustomersByLogin(parseInt(selectedLogin));
                if (customersData && customersData.errorCode === ServiceErrorCode.success) {
                  setCustomers(customersData.result || []);
                  setFilteredCustomers(customersData.result || []);
                }
              } catch (error) {
                console.error("Erreur lors du rechargement des clients:", error);
              } finally {
                setIsLoadingCustomers(false);
              }
            };
            loadCustomers();
          }
          // Réinitialiser la sélection du client après suppression
          setSelectedCustomer("");
          setCustomerSearchTerm("");
        }}
        customer={customers.find(c => c.id?.toString() === selectedCustomer) || null}
      />
      <CreateCarBrandDialog
        isOpen={isCreateCarBrandDialogOpen}
        onClose={() => setIsCreateCarBrandDialogOpen(false)}
        onCarBrandCreated={() => {
          // Recharger les marques après création
          const loadBrands = async () => {
            setIsLoadingBrands(true);
            try {
              const result = await CarBrandService.getAllCarBrands();
              if (result && result.errorCode === ServiceErrorCode.success) {
                setBrands(result.result || []);
                setFilteredBrands(result.result || []);
              }
            } catch (error) {
              console.error("Erreur lors du rechargement des marques:", error);
            } finally {
              setIsLoadingBrands(false);
            }
          };
          loadBrands();
        }}
      />
      <DeleteCarBrandDialog
        isOpen={isDeleteCarBrandDialogOpen}
        onClose={() => setIsDeleteCarBrandDialogOpen(false)}
        onCarBrandDeleted={() => {
          // Recharger les marques après suppression
          const loadBrands = async () => {
            setIsLoadingBrands(true);
            try {
              const result = await CarBrandService.getAllCarBrands();
              if (result && result.errorCode === ServiceErrorCode.success) {
                setBrands(result.result || []);
              }
            } catch (error) {
              console.error("Erreur lors du rechargement des marques:", error);
            } finally {
              setIsLoadingBrands(false);
            }
          };
          loadBrands();
          // Réinitialiser la sélection de marque et modèle
          setSelectedBrand("");
          setSelectedModel("");
        }}
        carBrand={brands.find(b => b.id?.toString() === selectedBrand) || null}
      />
      
      <CreateCarModelDialog
        isOpen={isCreateCarModelDialogOpen}
        onClose={() => setIsCreateCarModelDialogOpen(false)}
        brandId={parseInt(selectedBrand)}
        brandName={brands.find(b => b.id?.toString() === selectedBrand)?.brandName || ""}
        onCarModelCreated={() => {
          // Recharger les modèles après création
          if (selectedBrand && selectedBrand !== "loading" && selectedBrand !== "none") {
            const loadModels = async () => {
              setIsLoadingModels(true);
              try {
                const result = await CarModelService.getCarModelsByBrand(parseInt(selectedBrand));
                if (result && result.errorCode === ServiceErrorCode.success) {
                  setModels(result.result || []);
                  setFilteredModels(result.result || []);
                }
              } catch (error) {
                console.error("Erreur lors du rechargement des modèles:", error);
              } finally {
                setIsLoadingModels(false);
              }
            };
            loadModels();
          }
        }}
      />
      
      <DeleteCarModelDialog
        isOpen={isDeleteCarModelDialogOpen}
        onClose={() => setIsDeleteCarModelDialogOpen(false)}
        onCarModelDeleted={() => {
          // Recharger les modèles après suppression
          if (selectedBrand && selectedBrand !== "loading" && selectedBrand !== "none") {
            const loadModels = async () => {
              setIsLoadingModels(true);
              try {
                const result = await CarModelService.getCarModelsByBrand(parseInt(selectedBrand));
                if (result && result.errorCode === ServiceErrorCode.success) {
                  setModels(result.result || []);
                }
              } catch (error) {
                console.error("Erreur lors du rechargement des modèles:", error);
              } finally {
                setIsLoadingModels(false);
              }
            };
            loadModels();
          }
          // Réinitialiser la sélection du modèle
          setSelectedModel("");
        }}
        carModel={models.find(m => m.id?.toString() === selectedModel) || null}
      />
      
      <CreateSupplierDialog
        isOpen={isCreateSupplierDialogOpen}
        onClose={() => setIsCreateSupplierDialogOpen(false)}
        onSupplierCreated={() => {
          // Recharger les fournisseurs après création
          const loadSuppliers = async () => {
            setIsLoadingSuppliers(true);
            try {
              const result = await SupplierService.getAllSuppliers();
              if (result && result.errorCode === ServiceErrorCode.success) {
                setSuppliers(result.result || []);
                // setFilteredSuppliers(result.result || []); // This line is removed
              }
            } catch (error) {
              console.error("Erreur lors du rechargement des fournisseurs:", error);
            } finally {
              setIsLoadingSuppliers(false);
            }
          };
          loadSuppliers();
        }}
      />
      
      <DeleteSupplierDialog
        isOpen={isDeleteSupplierDialogOpen}
        onClose={() => setIsDeleteSupplierDialogOpen(false)}
        onSupplierDeleted={() => {
          // Recharger les fournisseurs après suppression
          const loadSuppliers = async () => {
            setIsLoadingSuppliers(true);
            try {
              const result = await SupplierService.getAllSuppliers();
              if (result && result.errorCode === ServiceErrorCode.success) {
                setSuppliers(result.result || []);
                // setFilteredSuppliers(result.result || []); // This line is removed
              }
            } catch (error) {
              console.error("Erreur lors du rechargement des fournisseurs:", error);
            } finally {
              setIsLoadingSuppliers(false);
            }
          };
          loadSuppliers();
          // Réinitialiser la sélection du fournisseur
          setSelectedSupplier("");
          // setSupplierSearchTerm(""); // This line is removed
        }}
        supplier={suppliers.find(s => s.id?.toString() === selectedSupplier) || null}
      />
      
      <CreateRegistrationDialog
        isOpen={isCreateRegistrationDialogOpen}
        onClose={() => setIsCreateRegistrationDialogOpen(false)}
        onRegistrationCreated={() => {
          // Recharger les plaques d'immatriculation après création
          const loadRegistrations = async () => {
            setIsLoadingRegistrations(true);
            try {
              const result = await RegistrationService.getAllRegistrations();
              if (result && result.errorCode === ServiceErrorCode.success) {
                setRegistrations(result.result || []);
                // setFilteredRegistrations(result.result || []); // This line is removed
              }
            } catch (error) {
              console.error("Erreur lors du rechargement des plaques:", error);
            } finally {
              setIsLoadingRegistrations(false);
            }
          };
          loadRegistrations();
        }}
      />
      
      <DeleteRegistrationDialog
        isOpen={isDeleteRegistrationDialogOpen}
        onClose={() => setIsDeleteRegistrationDialogOpen(false)}
        onRegistrationDeleted={() => {
          // Recharger les plaques d'immatriculation après suppression
          const loadRegistrations = async () => {
            setIsLoadingRegistrations(true);
            try {
              const result = await RegistrationService.getAllRegistrations();
              if (result && result.errorCode === ServiceErrorCode.success) {
                setRegistrations(result.result || []);
                // setFilteredRegistrations(result.result || []); // This line is removed
              }
            } catch (error) {
              console.error("Erreur lors du rechargement des plaques:", error);
            } finally {
              setIsLoadingRegistrations(false);
            }
          };
          loadRegistrations();
          // Réinitialiser la sélection de la plaque
          setSelectedRegistration("");
          // setRegistrationSearchTerm(""); // This line is removed
        }}
        registration={registrations.find(r => r.id?.toString() === selectedRegistration) || null}
      />
      
      <CreateItemDialog
        isOpen={isCreateItemDialogOpen}
        onClose={() => setIsCreateItemDialogOpen(false)}
        onItemCreated={() => {
          // Recharger les pièces après création
          const loadItems = async () => {
            setIsLoadingItems(true);
            try {
              const result = await ItemService.getAllItems();
              if (result && result.errorCode === ServiceErrorCode.success) {
                setItems(result.result || []);
                // setFilteredItems(result.result || []); // This line is removed
              }
            } catch (error) {
              console.error("Erreur lors du rechargement des pièces:", error);
            } finally {
              setIsLoadingItems(false);
            }
          };
          loadItems();
        }}
      />
      
      <DeleteItemDialog
        isOpen={isDeleteItemDialogOpen}
        onClose={() => setIsDeleteItemDialogOpen(false)}
        onItemDeleted={() => {
          // Recharger les pièces après suppression
          const loadItems = async () => {
            setIsLoadingItems(true);
            try {
              const result = await ItemService.getAllItems();
              if (result && result.errorCode === ServiceErrorCode.success) {
                setItems(result.result || []);
                // setFilteredItems([]); // This line is removed
              }
            } catch (error) {
              console.error("Erreur lors du rechargement des pièces:", error);
            } finally {
              setIsLoadingItems(false);
            }
          };
          loadItems();
        }}
        item={selectedItems.length > 0 ? items.find(i => i.id?.toString() === selectedItems[0].itemId) || null : null}
      />
    </AuthGuard>
  )
} 