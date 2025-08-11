import { Model, DataTypes, HasManyGetAssociationsMixin } from 'sequelize';
import sequelize from '../config/database.config';

export class Supplier extends Model {
    public id!: number;
    public supplierName!: string;
}

Supplier.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    supplierName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'supplier_name',
    },
}, {
    sequelize,
    tableName: 'supplier',
    timestamps: false,
}); 