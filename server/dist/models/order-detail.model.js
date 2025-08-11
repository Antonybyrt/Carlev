"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDetail = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
const item_model_1 = require("./item.model");
const order_model_1 = require("./order.model");
class OrderDetail extends sequelize_1.Model {
}
exports.OrderDetail = OrderDetail;
OrderDetail.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    itemId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'item_id',
        references: {
            model: item_model_1.Item,
            key: 'id',
        },
    },
    orderId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'order_id',
        references: {
            model: order_model_1.Order,
            key: 'id',
        },
    },
}, {
    sequelize: database_config_1.default,
    tableName: 'order_detail',
    timestamps: false,
});
OrderDetail.belongsTo(item_model_1.Item, { foreignKey: 'itemId', as: 'item' });
OrderDetail.belongsTo(order_model_1.Order, { foreignKey: 'orderId', as: 'order' });
item_model_1.Item.hasMany(OrderDetail, { foreignKey: 'itemId', as: 'orderDetails' });
order_model_1.Order.hasMany(OrderDetail, { foreignKey: 'orderId', as: 'orderDetails' });
