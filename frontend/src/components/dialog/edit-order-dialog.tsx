import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, X, Edit, Save, Plus, Trash2 } from "lucide-react";
import { ErrorService } from "@/services/error.service";
import OrderService from "@/services/order.service";
import CustomerService from "@/services/customer.service";
import CarBrandService from "@/services/car-brand.service";
import CarModelService from "@/services/car-model.service";
import SupplierService from "@/services/supplier.service";
import RegistrationService from "@/services/registration.service";
import LoginService from "@/services/login.service";
import ItemService from "@/services/item.service";
import OrderDetailService from "@/services/order-detail.service";
import { ServiceErrorCode } from "@/services/service.result";
import { IOrderExtended, IOrder } from "@/models/order.model";
import { ICustomer } from "@/models/customer.model";
import { ICarBrand } from "@/models/car-brand.model";
import { ICarModel } from "@/models/car-model.model";
import { ISupplier } from "@/models/supplier.model";
import { IRegistration } from "@/models/registration.model";
import { ILogin } from "@/models/login.model";
import { IItem } from "@/models/item.model";
import { IOrderDetail } from "@/models/order-detail.model";

interface EditOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated: () => void;
  order: IOrderExtended | null;
}

export function EditOrderDialog({ isOpen, onClose, onOrderUpdated, order }: EditOrderDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // États pour les données de sélection
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [carBrands, setCarBrands] = useState<ICarBrand[]>([]);
  const [carModels, setCarModels] = useState<ICarModel[]>([]);
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [registrations, setRegistrations] = useState<IRegistration[]>([]);
  const [logins, setLogins] = useState<ILogin[]>([]);
  const [items, setItems] = useState<IItem[]>([]);
  
  // États pour les détails de commande
  const [orderDetails, setOrderDetails] = useState<IOrderDetail[]>([]);
  
  // États pour les filtres de recherche
  const [customerSearch, setCustomerSearch] = useState("");
  const [carBrandSearch, setCarBrandSearch] = useState("");
  const [carModelSearch, setCarModelSearch] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [registrationSearch, setRegistrationSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  
  // États pour les recherches d'items par détail
  const [itemSearches, setItemSearches] = useState<{[key: number]: string}>({});
  
  // États pour le formulaire
  const [formData, setFormData] = useState<IOrder>({
    creationDate: new Date(),
    customerId: 0,
    carBrandId: 0,
    carModelId: 0,
    supplierId: 0,
    loginId: 0,
    registrationId: 0,
    notes: ""
  });

  // Charger les données nécessaires
  useEffect(() => {
    if (isOpen && order) {
      loadData();
      // Initialiser le formulaire avec les données de la commande
      setFormData({
        creationDate: new Date(order.creationDate),
        customerId: order.customerId,
        carBrandId: order.carBrandId,
        carModelId: order.carModelId,
        supplierId: order.supplierId,
        loginId: order.loginId,
        registrationId: order.registrationId,
        notes: order.notes || ""
      });
      
      // Initialiser les valeurs de recherche avec les données existantes
      if (order.customer) {
        setCustomerSearch(`${order.customer.firstName} ${order.customer.lastName}`);
      }
      if (order.carBrand) {
        setCarBrandSearch(order.carBrand.brandName);
      }
      if (order.carModel) {
        setCarModelSearch(order.carModel.modelName);
      }
      if (order.supplier) {
        setSupplierSearch(order.supplier.supplierName);
      }
      if (order.registration) {
        setRegistrationSearch(order.registration.registrationName);
      }
      // Initialiser les détails de commande
      if (order.orderDetails && order.orderDetails.length > 0) {
        const details = order.orderDetails.map(detail => ({
          id: detail.id,
          itemId: detail.itemId,
          quantity: detail.quantity,
          orderId: order.id || 0
        }));
        setOrderDetails(details);
        
        // Initialiser les recherches d'items avec les noms existants
        const searches: {[key: number]: string} = {};
        order.orderDetails.forEach((detail, index) => {
          if (detail.item?.itemName) {
            searches[index] = detail.item.itemName;
          }
        });
        setItemSearches(searches);
      } else {
        setOrderDetails([]);
        setItemSearches({});
      }
    }
  }, [isOpen, order]);

  // Charger les modèles de voiture quand la marque change
  useEffect(() => {
    if (formData.carBrandId > 0) {
      loadCarModels(formData.carBrandId);
    } else {
      setCarModels([]);
    }
  }, [formData.carBrandId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-dropdown')) {
        setCustomerSearch("");
        setCarBrandSearch("");
        setCarModelSearch("");
        setSupplierSearch("");
        setRegistrationSearch("");
        
        setItemSearches({});
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCustomerSearch("");
        setCarBrandSearch("");
        setCarModelSearch("");
        setSupplierSearch("");
        setRegistrationSearch("");
        
        setItemSearches({});
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [
        customersResult,
        carBrandsResult,
        suppliersResult,
        registrationsResult,
        loginsResult,
        itemsResult
      ] = await Promise.all([
        CustomerService.getAllCustomers(),
        CarBrandService.getAllCarBrands(),
        SupplierService.getAllSuppliers(),
        RegistrationService.getAllRegistrations(),
        LoginService.getAllLogins(),
        ItemService.getAllItems()
      ]);

      if (customersResult?.errorCode === ServiceErrorCode.success) {
        setCustomers(customersResult.result || []);
      }
      if (carBrandsResult?.errorCode === ServiceErrorCode.success) {
        setCarBrands(carBrandsResult.result || []);
      }
      if (suppliersResult?.errorCode === ServiceErrorCode.success) {
        setSuppliers(suppliersResult.result || []);
      }
      if (registrationsResult?.errorCode === ServiceErrorCode.success) {
        setRegistrations(registrationsResult.result || []);
      }
      if (loginsResult?.errorCode === ServiceErrorCode.success) {
        setLogins(loginsResult.result || []);
      }
      if (itemsResult?.errorCode === ServiceErrorCode.success) {
        setItems(itemsResult.result || []);
      }

      // Charger les modèles pour la marque sélectionnée
      if (formData.carBrandId > 0) {
        await loadCarModels(formData.carBrandId);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      ErrorService.errorMessage("Erreur", "Impossible de charger les données");
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadCarModels = async (brandId: number) => {
    try {
      const result = await CarModelService.getCarModelsByBrand(brandId);
      if (result?.errorCode === ServiceErrorCode.success) {
        setCarModels(result.result || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des modèles:", error);
    }
  };

  const handleInputChange = (field: keyof IOrder, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fonctions pour gérer les détails de commande
  const addOrderDetail = () => {
    const newDetail: IOrderDetail = {
      itemId: 0,
      quantity: 1,
      orderId: order?.id || 0
    };
    setOrderDetails(prev => [...prev, newDetail]);
  };

  const removeOrderDetail = (index: number) => {
    setOrderDetails(prev => prev.filter((_, i) => i !== index));
  };

  const updateOrderDetail = (index: number, field: keyof IOrderDetail, value: any) => {
    setOrderDetails(prev => prev.map((detail, i) => 
      i === index ? { ...detail, [field]: value } : detail
    ));
  };

  const getItemName = (itemId: number) => {
    const item = items.find(i => i.id === itemId);
    return item?.itemName || 'Pièce non trouvée';
  };

  // Fonctions de filtrage
  const getFilteredCustomers = () => {
    if (!customerSearch.trim()) return customers;
    return customers.filter(customer => 
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(customerSearch.toLowerCase())
    );
  };

  const getFilteredCarBrands = () => {
    if (!carBrandSearch.trim()) return carBrands;
    return carBrands.filter(brand => 
      brand.brandName.toLowerCase().includes(carBrandSearch.toLowerCase())
    );
  };

  const getFilteredCarModels = () => {
    if (!carModelSearch.trim()) return carModels;
    return carModels.filter(model => 
      model.modelName.toLowerCase().includes(carModelSearch.toLowerCase())
    );
  };

  const getFilteredSuppliers = () => {
    if (!supplierSearch.trim()) return suppliers;
    return suppliers.filter(supplier => 
      supplier.supplierName.toLowerCase().includes(supplierSearch.toLowerCase())
    );
  };

  const getFilteredRegistrations = () => {
    if (!registrationSearch.trim()) return registrations;
    return registrations.filter(registration => 
      registration.registrationName.toLowerCase().includes(registrationSearch.toLowerCase())
    );
  };

  const getFilteredItems = () => {
    if (!itemSearch.trim()) return items;
    return items.filter(item => 
      item.itemName.toLowerCase().includes(itemSearch.toLowerCase())
    );
  };

  const getFilteredItemsForDetail = (index: number) => {
    const searchTerm = itemSearches[index] || '';
    if (!searchTerm.trim()) return items;
    return items.filter(item => 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const updateItemSearch = (index: number, value: string) => {
    setItemSearches(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const closeAllDropdowns = () => {
    setCustomerSearch("");
    setCarBrandSearch("");
    setCarModelSearch("");
    setSupplierSearch("");
    setRegistrationSearch("");
    setItemSearches({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!order?.id) {
      ErrorService.errorMessage("Erreur", "Commande non trouvée");
      return;
    }

    // Validation
    if (!formData.customerId || !formData.carBrandId || !formData.carModelId || 
        !formData.supplierId || !formData.loginId || !formData.registrationId) {
      ErrorService.errorMessage("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Validation des détails de commande
    const invalidDetails = orderDetails.filter(detail => !detail.itemId || detail.quantity <= 0);
    if (invalidDetails.length > 0) {
      ErrorService.errorMessage("Erreur", "Veuillez sélectionner une pièce et une quantité valide pour tous les détails");
      return;
    }

    setIsLoading(true);
    try {
      const result = await OrderService.updateOrder(order.id, formData);

      if (result && result.errorCode === ServiceErrorCode.success) {
        await OrderDetailService.deleteOrderDetailsByOrderId(order.id);
        
        for (const detail of orderDetails) {
          if (detail.itemId && detail.quantity > 0) {
            await OrderDetailService.createOrderDetail({
              ...detail,
              orderId: order.id
            });
          }
        }

        ErrorService.successMessage("Succès", "Commande modifiée avec succès");
        onOrderUpdated();
        handleClose();
      } else {
        ErrorService.errorMessage("Erreur", "Impossible de modifier la commande");
      }
    } catch (error) {
      console.error("Erreur lors de la modification de la commande:", error);
      ErrorService.errorMessage("Erreur", "Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsLoading(false);
    setCustomerSearch("");
    setCarBrandSearch("");
    setCarModelSearch("");
    setSupplierSearch("");
    setRegistrationSearch("");
    setItemSearches({});
    onClose();
  };

  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Edit className="w-5 h-5 text-blue-400" />
                <span>Modifier la commande #{order.id}</span>
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {isLoadingData ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Chargement des données...</p>
                </div>
              ) : (
                <>
                  {/* Informations générales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="creationDate" className="text-gray-300">Date de création</Label>
                      <Input
                        id="creationDate"
                        type="date"
                        value={formData.creationDate ? new Date(formData.creationDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleInputChange('creationDate', new Date(e.target.value))}
                        className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="loginId" className="text-gray-300">Compte *</Label>
                      <Input
                        id="loginId"
                        value={order?.login?.loginName || "Non spécifié"}
                        disabled
                        className="bg-gray-600/60 border-gray-500 text-gray-400 cursor-not-allowed"
                        placeholder="Compte non modifiable"
                      />
                    </div>
                  </div>

                  {/* Client */}
                  <div className="space-y-2">
                    <Label htmlFor="customerId" className="text-gray-300">Client *</Label>
                    <div className="relative search-dropdown">
                      <Input
                        placeholder="Rechercher un client..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                      />
                      {customerSearch && (
                        <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {getFilteredCustomers().map((customer) => (
                            <div
                              key={customer.id}
                              onClick={() => {
                                handleInputChange('customerId', customer.id);
                                setCustomerSearch(`${customer.firstName} ${customer.lastName}`);
                                closeAllDropdowns();
                              }}
                              className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                            >
                              {customer.firstName} {customer.lastName}
                            </div>
                          ))}
                          {getFilteredCustomers().length === 0 && (
                            <div className="px-3 py-2 text-gray-400">Aucun client trouvé</div>
                          )}
                        </div>
                      )}
                    </div>
                    {formData.customerId > 0 && (
                      <div className="text-sm text-green-400">
                        Sélectionné: {customers.find(c => c.id === formData.customerId)?.firstName} {customers.find(c => c.id === formData.customerId)?.lastName}
                      </div>
                    )}
                  </div>

                  {/* Véhicule */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="carBrandId" className="text-gray-300">Marque *</Label>
                      <div className="relative search-dropdown">
                        <Input
                          placeholder="Rechercher une marque..."
                          value={carBrandSearch}
                          onChange={(e) => setCarBrandSearch(e.target.value)}
                          className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                        />
                        {carBrandSearch && (
                          <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {getFilteredCarBrands().map((brand) => (
                              <div
                                key={brand.id}
                                onClick={() => {
                                  handleInputChange('carBrandId', brand.id);
                                  handleInputChange('carModelId', 0); // Reset model when brand changes
                                  setCarBrandSearch(brand.brandName);
                                  closeAllDropdowns();
                                }}
                                className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                              >
                                {brand.brandName}
                              </div>
                            ))}
                            {getFilteredCarBrands().length === 0 && (
                              <div className="px-3 py-2 text-gray-400">Aucune marque trouvée</div>
                            )}
                          </div>
                        )}
                      </div>
                      {formData.carBrandId > 0 && (
                        <div className="text-sm text-green-400">
                          Sélectionné: {carBrands.find(b => b.id === formData.carBrandId)?.brandName}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="carModelId" className="text-gray-300">Modèle *</Label>
                      <div className="relative search-dropdown">
                        <Input
                          placeholder="Rechercher un modèle..."
                          value={carModelSearch}
                          onChange={(e) => setCarModelSearch(e.target.value)}
                          disabled={!formData.carBrandId || carModels.length === 0}
                          className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 disabled:bg-gray-600/40 disabled:text-gray-500"
                        />
                        {carModelSearch && formData.carBrandId > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {getFilteredCarModels().map((model) => (
                              <div
                                key={model.id}
                                onClick={() => {
                                  handleInputChange('carModelId', model.id);
                                  setCarModelSearch(model.modelName);
                                  closeAllDropdowns();
                                }}
                                className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                              >
                                {model.modelName}
                              </div>
                            ))}
                            {getFilteredCarModels().length === 0 && (
                              <div className="px-3 py-2 text-gray-400">Aucun modèle trouvé</div>
                            )}
                          </div>
                        )}
                      </div>
                      {formData.carModelId > 0 && (
                        <div className="text-sm text-green-400">
                          Sélectionné: {carModels.find(m => m.id === formData.carModelId)?.modelName}
                        </div>
                      )}
                      {!formData.carBrandId && (
                        <div className="text-sm text-gray-400">Sélectionnez d'abord une marque</div>
                      )}
                    </div>
                  </div>

                  {/* Fournisseur et Plaque */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="supplierId" className="text-gray-300">Fournisseur *</Label>
                      <div className="relative search-dropdown">
                        <Input
                          placeholder="Rechercher un fournisseur..."
                          value={supplierSearch}
                          onChange={(e) => setSupplierSearch(e.target.value)}
                          className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                        />
                        {supplierSearch && (
                          <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {getFilteredSuppliers().map((supplier) => (
                              <div
                                key={supplier.id}
                                onClick={() => {
                                  handleInputChange('supplierId', supplier.id);
                                  setSupplierSearch(supplier.supplierName);
                                  closeAllDropdowns();
                                }}
                                className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                              >
                                {supplier.supplierName}
                              </div>
                            ))}
                            {getFilteredSuppliers().length === 0 && (
                              <div className="px-3 py-2 text-gray-400">Aucun fournisseur trouvé</div>
                            )}
                          </div>
                        )}
                      </div>
                      {formData.supplierId > 0 && (
                        <div className="text-sm text-green-400">
                          Sélectionné: {suppliers.find(s => s.id === formData.supplierId)?.supplierName}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registrationId" className="text-gray-300">Plaque *</Label>
                      <div className="relative search-dropdown">
                        <Input
                          placeholder="Rechercher une plaque..."
                          value={registrationSearch}
                          onChange={(e) => setRegistrationSearch(e.target.value)}
                          className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                        />
                        {registrationSearch && (
                          <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {getFilteredRegistrations().map((registration) => (
                              <div
                                key={registration.id}
                                onClick={() => {
                                  handleInputChange('registrationId', registration.id);
                                  setRegistrationSearch(registration.registrationName);
                                  closeAllDropdowns();
                                }}
                                className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                              >
                                {registration.registrationName}
                              </div>
                            ))}
                            {getFilteredRegistrations().length === 0 && (
                              <div className="px-3 py-2 text-gray-400">Aucune plaque trouvée</div>
                            )}
                          </div>
                        )}
                      </div>
                      {formData.registrationId > 0 && (
                        <div className="text-sm text-green-400">
                          Sélectionné: {registrations.find(r => r.id === formData.registrationId)?.registrationName}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-gray-300">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Ajoutez des notes pour cette commande..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 min-h-[100px]"
                      rows={4}
                    />
                  </div>

                  {/* Pièces commandées */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300 text-lg font-semibold">Pièces commandées</Label>
                      <Button
                        type="button"
                        onClick={addOrderDetail}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter une pièce
                      </Button>
                    </div>

                    {orderDetails.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Aucune pièce commandée</p>
                        <p className="text-sm">Cliquez sur "Ajouter une pièce" pour commencer</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {orderDetails.map((detail, index) => (
                          <div key={index} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                              <div className="space-y-2 md:col-span-2">
                                <Label className="text-gray-300 text-sm">Pièce *</Label>
                                <div className="relative search-dropdown">
                                  <Input
                                    placeholder="Rechercher une pièce..."
                                    value={itemSearches[index] || ''}
                                    onChange={(e) => updateItemSearch(index, e.target.value)}
                                    className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                                  />
                                  {itemSearches[index] && itemSearches[index].trim() && (
                                    <div className="absolute z-20 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                      {getFilteredItemsForDetail(index).map((item) => (
                                        <div
                                          key={item.id}
                                          onClick={() => {
                                            updateOrderDetail(index, 'itemId', item.id);
                                            updateItemSearch(index, item.itemName);
                                            closeAllDropdowns();
                                          }}
                                          className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
                                        >
                                          {item.itemName}
                                        </div>
                                      ))}
                                      {getFilteredItemsForDetail(index).length === 0 && (
                                        <div className="px-3 py-2 text-gray-400">Aucune pièce trouvée</div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                {detail.itemId > 0 && (
                                  <div className="text-xs text-green-400">
                                    Sélectionné: {items.find(i => i.id === detail.itemId)?.itemName}
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label className="text-gray-300 text-sm">Quantité *</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={detail.quantity}
                                  onChange={(e) => updateOrderDetail(index, 'quantity', parseInt(e.target.value) || 1)}
                                  className="bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400"
                                />
                              </div>

                              <div className="flex justify-end items-end">
                                <Button
                                  type="button"
                                  onClick={() => removeOrderDetail(index)}
                                  variant="outline"
                                  size="sm"
                                  className="border-red-500/30 text-red-400 hover:text-red-300 hover:border-red-400 hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex space-x-3 pt-6 border-t border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 bg-transparent hover:bg-gray-700"
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || isLoadingData}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Modification...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Modifier la commande
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
