import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize';
import sequelize from '../config/database.config';
import { CarBrand } from './car-brand.model';

export class CarModel extends Model {
    public id!: number;
    public modelName!: string;
    public brandId!: number;

    public brand?: CarBrand;
    public getBrand!: BelongsToGetAssociationMixin<CarBrand>;
}

CarModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    modelName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'model_name',
    },
    brandId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'brand_id',
        references: {
            model: CarBrand,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    sequelize,
    tableName: 'car_model',
    timestamps: false,
});

CarModel.belongsTo(CarBrand, { foreignKey: 'brandId', as: 'brand' });
CarBrand.hasMany(CarModel, { foreignKey: 'brandId', as: 'models' }); 