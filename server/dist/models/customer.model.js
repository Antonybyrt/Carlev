"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
const login_model_1 = require("./login.model");
class Customer extends sequelize_1.Model {
}
exports.Customer = Customer;
Customer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: 'first_name',
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'last_name',
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
}, {
    sequelize: database_config_1.default,
    tableName: 'customer',
    timestamps: false,
});
Customer.belongsTo(login_model_1.Login, { foreignKey: 'loginId', as: 'login' });
login_model_1.Login.hasMany(Customer, { foreignKey: 'loginId', as: 'customers' });
