export interface IOrder {
  id?: number;
  creationDate: Date;
  customerId: number;
  carBrandId: number;
  carModelId: number;
  supplierId: number;
  loginId: number;
  registrationId: number;
}

export interface IOrderResponse {
  newOrder: IOrder;
} 