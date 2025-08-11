import { Model, DataTypes, HasManyGetAssociationsMixin } from 'sequelize';
import sequelize from '../config/database.config';

export class Login extends Model {
    public id!: number;
    public loginName!: string;
}

Login.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    loginName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'login_name',
    },
}, {
    sequelize,
    tableName: 'login',
    timestamps: false,
}); 