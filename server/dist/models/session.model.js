"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSession = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
const user_model_1 = require("./user.model");
class UserSession extends sequelize_1.Model {
}
exports.UserSession = UserSession;
UserSession.init({
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user_model_1.User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    expirationDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
}, {
    sequelize: database_config_1.default,
    tableName: 'user_session',
    timestamps: false,
});
user_model_1.User.hasMany(UserSession, { foreignKey: 'user_id', as: 'sessions' });
UserSession.belongsTo(user_model_1.User, { foreignKey: 'user_id', as: 'user' });
