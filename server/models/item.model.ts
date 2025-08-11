import { Model, DataTypes, HasManyGetAssociationsMixin } from 'sequelize';
import sequelize from '../config/database.config';

export class Item extends Model {
    public id!: number;
    public itemName!: string;
}

Item.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    itemName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'item_name',
    },
}, {
    sequelize,
    tableName: 'item',
    timestamps: false,
}); 