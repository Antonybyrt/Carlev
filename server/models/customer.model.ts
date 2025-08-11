import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize';
import sequelize from '../config/database.config';
import { Login } from './login.model';

export class Customer extends Model {
    public id!: number;
    public firstName?: string;
    public lastName!: string;
    public loginId!: number;

    public login?: Login;
    public getLogin!: BelongsToGetAssociationMixin<Login>;
}

Customer.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'first_name',
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name',
    },
    loginId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'login_id',
        references: {
            model: Login,
            key: 'id',
        },
    },
}, {
    sequelize,
    tableName: 'customer',
    timestamps: false,
});

Customer.belongsTo(Login, { foreignKey: 'loginId', as: 'login' });
Login.hasMany(Customer, { foreignKey: 'loginId', as: 'customers' }); 