import { Model, DataTypes, HasManyGetAssociationsMixin } from 'sequelize';
import sequelize from '../config/database.config';

export class CarBrand extends Model {
    public id!: number;
    public brandName!: string;
}

CarBrand.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    brandName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'brand_name',
    },
}, {
    sequelize,
    tableName: 'car_brand',
    timestamps: false,
}); 