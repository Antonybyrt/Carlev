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

export interface IOrderExtended extends IOrder {
  customer?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  carBrand?: {
    id: number;
    brandName: string;
  };
  carModel?: {
    id: number;
    modelName: string;
  };
  supplier?: {
    id: number;
    supplierName: string;
  };
  login?: {
    id: number;
    loginName: string;
  };
  registration?: {
    id: number;
    registrationName: string;
  };
  orderDetails?: Array<{
    id: number;
    itemId: number;
    quantity: number;
    item: {
      id: number;
      itemName: string;
    };
  }>;
} 