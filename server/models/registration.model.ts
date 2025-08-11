import { Model, DataTypes, HasManyGetAssociationsMixin } from 'sequelize';
import sequelize from '../config/database.config';

export class Registration extends Model {
    public id!: number;
    public registrationName!: string;
}

Registration.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    registrationName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'registration_name',
    },
}, {
    sequelize,
    tableName: 'registration',
    timestamps: false,
}); 