"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarModel = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
const car_brand_model_1 = require("./car-brand.model");
class CarModel extends sequelize_1.Model {
}
exports.CarModel = CarModel;
CarModel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    modelName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'model_name',
    },
    brandId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'brand_id',
        references: {
            model: car_brand_model_1.CarBrand,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    sequelize: database_config_1.default,
    tableName: 'car_model',
    timestamps: false,
});
CarModel.belongsTo(car_brand_model_1.CarBrand, { foreignKey: 'brandId', as: 'brand' });
car_brand_model_1.CarBrand.hasMany(CarModel, { foreignKey: 'brandId', as: 'models' });
