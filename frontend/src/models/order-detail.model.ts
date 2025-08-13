export interface IOrderDetail {
  id?: number;
  itemId: number;
  quantity: number;
  orderId: number;
}

export interface IOrderDetailExtended extends IOrderDetail {
  item?: {
    id: number;
    itemName: string;
  };
} 