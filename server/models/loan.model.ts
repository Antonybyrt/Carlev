import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize';
import sequelize from '../config/database.config';
import { Customer } from './customer.model';

export class Loan extends Model {
    public id!: number;
    public loanerCarId!: number;
    public orNumber!: number;
    public customerId!: number;
    public startDate!: Date;
    public endDate?: Date;
    public notes?: string;

    public loanerCar?: any;
    public customer?: Customer;

    public getLoanerCar!: BelongsToGetAssociationMixin<any>;
    public getCustomer!: BelongsToGetAssociationMixin<Customer>;
}

Loan.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    loanerCarId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'loaner_car_id',
        references: {
            model: 'loaner_car',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    orNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'or_number',
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'customer_id',
        references: {
            model: Customer,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_date',
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'end_date',
    },
    notes: {
        type: DataTypes.STRING(1500),
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'loan',
    timestamps: false,
});

export function setupLoanAssociations() {
    const { LoanerCar } = require('./loaner-car.model');
    Loan.belongsTo(LoanerCar, { foreignKey: 'loanerCarId', as: 'loanerCar' });
    Loan.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
}
