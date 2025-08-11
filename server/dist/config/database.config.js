"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const sequelize = new sequelize_1.Sequelize('Carlev', process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.HOST,
    port: Number(process.env.PORT),
    dialect: 'mysql',
    dialectOptions: {
        socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    },
});
exports.default = sequelize;
