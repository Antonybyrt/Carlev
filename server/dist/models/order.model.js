"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
const customer_model_1 = require("./customer.model");
const car_brand_model_1 = require("./car-brand.model");
const car_model_model_1 = require("./car-model.model");
const supplier_model_1 = require("./supplier.model");
const login_model_1 = require("./login.model");
const registration_model_1 = require("./registration.model");
class Order extends sequelize_1.Model {
}
exports.Order = Order;
Order.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    creationDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'creation_date',
    },
    customerId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'customer_id',
        references: {
            model: customer_model_1.Customer,
            key: 'id',
        },
    },
    carBrandId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'car_brand_id',
        references: {
            model: car_brand_model_1.CarBrand,
            key: 'id',
        },
    },
    carModelId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'car_model_id',
        references: {
            model: car_model_model_1.CarModel,
            key: 'id',
        },
    },
    supplierId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'supplier_id',
        references: {
            model: supplier_model_1.Supplier,
            key: 'id',
        },
    },
    loginId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'login_id',
        references: {
            model: login_model_1.Login,
            key: 'id',
        },
    },
    registrationId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'registration_id',
        references: {
            model: registration_model_1.Registration,
            key: 'id',
        },
    },
}, {
    sequelize: database_config_1.default,
    tableName: 'orders',
    timestamps: false,
});
Order.belongsTo(customer_model_1.Customer, { foreignKey: 'customerId', as: 'customer' });
Order.belongsTo(car_brand_model_1.CarBrand, { foreignKey: 'carBrandId', as: 'carBrand' });
Order.belongsTo(car_model_model_1.CarModel, { foreignKey: 'carModelId', as: 'carModel' });
Order.belongsTo(supplier_model_1.Supplier, { foreignKey: 'supplierId', as: 'supplier' });
Order.belongsTo(login_model_1.Login, { foreignKey: 'loginId', as: 'login' });
Order.belongsTo(registration_model_1.Registration, { foreignKey: 'registrationId', as: 'registration' });
customer_model_1.Customer.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
car_brand_model_1.CarBrand.hasMany(Order, { foreignKey: 'carBrandId', as: 'orders' });
car_model_model_1.CarModel.hasMany(Order, { foreignKey: 'carModelId', as: 'orders' });
supplier_model_1.Supplier.hasMany(Order, { foreignKey: 'supplierId', as: 'orders' });
login_model_1.Login.hasMany(Order, { foreignKey: 'loginId', as: 'orders' });
registration_model_1.Registration.hasMany(Order, { foreignKey: 'registrationId', as: 'orders' });
