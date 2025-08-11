// Services d'authentification et utilisateur
export { default as auth } from './auth.service';

// Services de gestion des commandes
export { default as OrderService } from './order.service';
export { default as OrderDetailService } from './order-detail.service';

// Services de gestion des clients et fournisseurs
export { default as CustomerService } from './customer.service';
export { default as SupplierService } from './supplier.service';

// Services de gestion des véhicules
export { default as CarBrandService } from './car-brand.service';
export { default as CarModelService } from './car-model.service';

// Services de gestion des articles
export { default as ItemService } from './item.service';

// Services de gestion des plaques d'immatriculation
export { default as RegistrationService } from './registration.service';

// Services utilitaires
export { ApiService } from './api.service';
export { ErrorService } from './error.service';

// Types et interfaces (maintenant importés depuis les modèles)
export * from './service.result'; 