import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize';
import sequelize from '../config/database.config';
import { Item } from './item.model';
import { Order } from './order.model';

export class OrderDetail extends Model {
    public id!: number;
    public quantity!: number;
    public itemId!: number;
    public orderId!: number;

    public item?: Item;
    public order?: Order;

    public getItem!: BelongsToGetAssociationMixin<Item>;
    public getOrder!: BelongsToGetAssociationMixin<Order>;
}

OrderDetail.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'item_id',
        references: {
            model: Item,
            key: 'id',
        },
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_id',
        references: {
            model: Order,
            key: 'id',
        },
    },
}, {
    sequelize,
    tableName: 'order_detail',
    timestamps: false,
});

OrderDetail.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });
OrderDetail.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Item.hasMany(OrderDetail, { foreignKey: 'itemId', as: 'orderDetails' });
Order.hasMany(OrderDetail, { foreignKey: 'orderId', as: 'orderDetails' }); 