import { Model, DataTypes, BelongsToGetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import sequelize from '../config/database.config';

export class LoanerCar extends Model {
    public id!: number;
    public carBrandId!: number;
    public carModelId!: number;
    public registrationId!: number;
    public status!: string;
    public isDeleted!: boolean;

    public brand?: any;
    public model?: any;
    public registration?: any;
    public loans?: any[];

    public getBrand!: BelongsToGetAssociationMixin<any>;
    public getModel!: BelongsToGetAssociationMixin<any>;
    public getRegistration!: BelongsToGetAssociationMixin<any>;
    public getLoans!: HasManyGetAssociationsMixin<any>;
}

LoanerCar.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    carBrandId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'car_brand_id',
        references: {
            model: 'car_brand',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    carModelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'car_model_id',
        references: {
            model: 'car_model',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    registrationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'registration_id',
        references: {
            model: 'registration',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_deleted',
    },
}, {
    sequelize,
    tableName: 'loaner_car',
    timestamps: false,
});

export function setupLoanerCarAssociations() {
    const { CarBrand } = require('./car-brand.model');
    const { CarModel } = require('./car-model.model');
    const { Registration } = require('./registration.model');
    const { Loan } = require('./loan.model');
    
    LoanerCar.belongsTo(CarBrand, { foreignKey: 'carBrandId', as: 'brand' });
    LoanerCar.belongsTo(CarModel, { foreignKey: 'carModelId', as: 'model' });
    LoanerCar.belongsTo(Registration, { foreignKey: 'registrationId', as: 'registration' });
    LoanerCar.hasMany(Loan, { foreignKey: 'loanerCarId', as: 'loans' });
}
