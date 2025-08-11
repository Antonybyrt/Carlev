"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarBrand = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
class CarBrand extends sequelize_1.Model {
}
exports.CarBrand = CarBrand;
CarBrand.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    brandName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'brand_name',
    },
}, {
    sequelize: database_config_1.default,
    tableName: 'car_brand',
    timestamps: false,
});
