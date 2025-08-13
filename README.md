# CarLev - Répertoire de Commandes de Pièces pour Carrosserie

## 🚗 Description du Projet

**CarLev** est une application web complète de gestion de répertoire de commandes de pièces automobiles pour carrosseries. Le système permet aux professionnels de l'automobile de gérer efficacement leurs commandes, clients, fournisseurs et inventaire de pièces.

### Fonctionnalités Principales

- **Gestion des Clients** : Suivi des clients par compte utilisateur
- **Catalogue Automobile** : Gestion des marques et modèles de véhicules
- **Gestion des Fournisseurs** : Suivi des fournisseurs de pièces
- **Commandes** : Création et suivi des commandes de pièces
- **Inventaire** : Gestion des articles et pièces disponibles
- **Comptes Utilisateurs** : Système d'authentification et de sessions
- **Statistiques** : Compteurs et rapports par compte
- **Voitures de Prêt** : Gestion du parc de véhicules de prêt
- **Système de Prêts** : Suivi des prêts de véhicules aux clients

## 🏗️ Architecture Technique

### Backend
- **Node.js** avec **TypeScript**
- **Express.js** pour l'API REST
- **Sequelize** ORM avec **MySQL**
- Architecture en couches : Contrôleurs → Services → Modèles

### Frontend
- **Next.js** avec **TypeScript**
- **React** pour l'interface utilisateur
- Design moderne et responsive

## 🗄️ Structure de la Base de Données

### Entités Principales
- **User** : Utilisateurs du système
- **Login** : Comptes de connexion
- **Customer** : Clients des carrosseries
- **CarBrand** : Marques de véhicules
- **CarModel** : Modèles de véhicules
- **Supplier** : Fournisseurs de pièces
- **Registration** : Enregistrements de véhicules
- **Order** : Commandes de pièces
- **Item** : Articles/pièces disponibles
- **OrderDetail** : Détails des commandes
- **LoanerCar** : Voitures de prêt disponibles
- **Loan** : Historique des prêts de véhicules

## 🔐 Système d'Authentification

Toutes les routes (sauf `/auth/*`) nécessitent une authentification valide via un token Bearer dans l'en-tête `Authorization`.

### Format du Token
```
Authorization: Bearer <votre_token_jwt>
```

### Vérifications Automatiques
- **Validité du token** : Vérification de l'existence de la session
- **Expiration** : Vérification automatique de la date d'expiration
- **Nettoyage** : Suppression automatique des sessions expirées
- **Sécurité** : Injection des informations utilisateur dans la requête

### Routes Publiques
```
POST   /auth/login          - Connexion utilisateur
POST   /auth/logout         - Déconnexion utilisateur
```

## 📡 API Routes

### 👤 Utilisateurs
```
GET    /user/:token         - Récupérer un utilisateur par session
```

### 🏷️ Marques de Véhicules
```
GET    /car_brand           - Liste de toutes les marques
POST   /car_brand           - Créer une nouvelle marque
DELETE /car_brand/:id       - Supprimer une marque
```

### 🚙 Modèles de Véhicules
```
GET    /car_model/models/:brand_id    - Modèles d'une marque spécifique
POST   /car_model/:brand_id           - Créer un modèle pour une marque
DELETE /car_model/:id                 - Supprimer un modèle
```

### 👥 Clients
```
GET    /customer                    - Liste de tous les clients
GET    /customer/customer/:login_id - Clients d'un compte spécifique
POST   /customer/:login_id          - Créer un client pour un compte
DELETE /customer/:id                - Supprimer un client
GET    /customer/count              - Nombre total de clients
```

### 📦 Articles/Pièces
```
GET    /item           - Liste de tous les articles
POST   /item           - Créer un nouvel article
DELETE /item/:id       - Supprimer un article
```

### 🔑 Comptes de Connexion
```
GET    /login          - Liste de tous les comptes de connexion
```

### 📋 Commandes
```
POST   /orders/orders              - Créer une nouvelle commande
GET    /orders/orderDetails        - Détails complets de toutes les commandes
GET    /orders/byAccount           - Statistiques des commandes par compte
DELETE /orders/delete/:order_id    - Supprimer une commande
```

### 📝 Détails de Commandes
```
GET    /order_detail               - Liste de tous les détails de commandes
POST   /order_detail               - Créer un détail de commande
```

### 🚗 Enregistrements de Véhicules
```
GET    /registration               - Liste de toutes les plaques
POST   /registration               - Créer une nouvelle plaque
DELETE /registration/:id           - Supprimer une plaque
GET    /registration/count         - Nombre total de plaques
```

### 🏪 Fournisseurs
```
GET    /supplier           - Liste de tous les fournisseurs
POST   /supplier           - Créer un nouveau fournisseur
DELETE /supplier/:id       - Supprimer un fournisseur
GET    /supplier/count     - Nombre total de fournisseurs
```

### Voitures de Prêt

#### Routes disponibles :
- `GET /loaner_car` - Récupérer toutes les voitures de prêt
- `GET /loaner_car/:id` - Récupérer une voiture de prêt par ID
- `POST /loaner_car` - Créer une nouvelle voiture de prêt
- `PATCH /loaner_car/:id` - Archiver une voiture de prêt (soft delete)
- `PUT /loaner_car/:id` - Mettre à jour une voiture de prêt

#### Exemple de données pour la création :
```json
{
  "carBrandId": 1,
  "carModelId": 1,
  "registrationId": 1,
  "status": "DISPONIBLE"
}
```

#### Exemple de données pour la mise à jour :
```json
{
  "carBrandId": 2,
  "carModelId": 3,
  "registrationId": 5,
  "status": "EN_PRET"
}
```

### 📋 Système de Prêts
```
GET    /loan                       - Liste de tous les prêts
GET    /loan/:id                   - Récupérer un prêt spécifique
POST   /loan                       - Créer un nouveau prêt
DELETE /loan/:id                   - Supprimer un prêt
```

## 🔧 Structure des Données

### Exemple de Commande
```json
{
  "creationDate": "2024-01-15T10:30:00Z",
  "customerId": 1,
  "carBrandId": 2,
  "carModelId": 5,
  "supplierId": 3,
  "loginId": 1,
  "registrationId": 1
}
```

### Exemple de Détail de Commande
```json
{
  "quantity": 2,
  "itemId": 15,
  "orderId": 1
}
```

### Exemple de Voiture de Prêt
```json
{
  "carBrandId": 2,
  "carModelId": 5,
  "registrationId": 1,
  "status": "disponible"
}
```

### Exemple de Prêt
```json
{
  "loanerCarId": 1,
  "orNumber": 12345,
  "customerId": 1,
  "startDate": "2024-01-15T10:00:00Z",
  "endDate": "2024-01-20T18:00:00Z",
  "notes": "Prêt pour réparation carrosserie"
}
```

## 📊 Fonctionnalités Avancées

- **Gestion des Relations** : Liens automatiques entre entités
- **Validation des Données** : Vérification des contraintes métier
- **Gestion d'Erreurs** : Codes d'erreur standardisés
- **Sécurité** : Sessions utilisateur et authentification
- **Performance** : Requêtes optimisées avec Sequelize
- **Gestion des Prêts** : Suivi complet des véhicules prêtés aux clients
- **Statut des Véhicules** : Suivi de la disponibilité des voitures de prêt

## 🎯 Cas d'Usage

1. **Carrossier** : Créer des commandes de pièces pour des véhicules spécifiques
2. **Gestionnaire** : Suivre les commandes et gérer les fournisseurs
3. **Comptable** : Consulter les statistiques par compte
4. **Technicien** : Identifier rapidement les pièces nécessaires
5. **Responsable de Flotte** : Gérer le parc de véhicules de prêt
6. **Accueil** : Organiser les prêts de véhicules aux clients

## 📝 Licence

Ce projet est sous licence AGPL3.0. Voir le fichier LICENSE pour plus de détails.