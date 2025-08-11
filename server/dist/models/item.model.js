"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
class Item extends sequelize_1.Model {
}
exports.Item = Item;
Item.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    itemName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'item_name',
    },
}, {
    sequelize: database_config_1.default,
    tableName: 'item',
    timestamps: false,
});
