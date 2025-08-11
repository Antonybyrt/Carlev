import { Model, DataTypes, BelongsToGetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize';
import sequelize from '../config/database.config';
import { Customer } from './customer.model';
import { CarBrand } from './car-brand.model';
import { CarModel } from './car-model.model';
import { Supplier } from './supplier.model';
import { Login } from './login.model';
import { Registration } from './registration.model';

export class Order extends Model {
    public id!: number;
    public creationDate!: Date;
    public customerId!: number;
    public carBrandId!: number;
    public carModelId!: number;
    public supplierId!: number;
    public loginId!: number;
    public registrationId!: number;

    public customer?: Customer;
    public carBrand?: CarBrand;
    public carModel?: CarModel;
    public supplier?: Supplier;
    public login?: Login;
    public registration?: Registration;

    public getCustomer!: BelongsToGetAssociationMixin<Customer>;
    public getCarBrand!: BelongsToGetAssociationMixin<CarBrand>;
    public getCarModel!: BelongsToGetAssociationMixin<CarModel>;
    public getSupplier!: BelongsToGetAssociationMixin<Supplier>;
    public getLogin!: BelongsToGetAssociationMixin<Login>;
    public getRegistration!: BelongsToGetAssociationMixin<Registration>;
}

Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    creationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'creation_date',
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'customer_id',
        references: {
            model: Customer,
            key: 'id',
        },
    },
    carBrandId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'car_brand_id',
        references: {
            model: CarBrand,
            key: 'id',
        },
    },
    carModelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'car_model_id',
        references: {
            model: CarModel,
            key: 'id',
        },
    },
    supplierId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'supplier_id',
        references: {
            model: Supplier,
            key: 'id',
        },
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
    registrationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'registration_id',
        references: {
            model: Registration,
            key: 'id',
        },
    },
}, {
    sequelize,
    tableName: 'orders',
    timestamps: false,
});

Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Order.belongsTo(CarBrand, { foreignKey: 'carBrandId', as: 'carBrand' });
Order.belongsTo(CarModel, { foreignKey: 'carModelId', as: 'carModel' });
Order.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });
Order.belongsTo(Login, { foreignKey: 'loginId', as: 'login' });
Order.belongsTo(Registration, { foreignKey: 'registrationId', as: 'registration' });

Customer.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
CarBrand.hasMany(Order, { foreignKey: 'carBrandId', as: 'orders' });
CarModel.hasMany(Order, { foreignKey: 'carModelId', as: 'orders' });
Supplier.hasMany(Order, { foreignKey: 'supplierId', as: 'orders' });
Login.hasMany(Order, { foreignKey: 'loginId', as: 'orders' });
Registration.hasMany(Order, { foreignKey: 'registrationId', as: 'orders' }); 