import { Sequelize } from 'sequelize';
import { config } from 'dotenv'
config();

const sequelize = new Sequelize('Carlev', process.env.DATABASE_USERNAME as string, process.env.DATABASE_PASSWORD, {
    host: process.env.HOST,
    port: Number(process.env.PORT),
    dialect: 'mysql',
    logging: console.log,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    retry: {
        max: 3
    }
    // dialectOptions: {
    //     socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    // },
});

export default sequelize;