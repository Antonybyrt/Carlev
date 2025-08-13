export interface ILoanerCar {
  id?: number;
  carBrandId: number;
  carModelId: number;
  registrationId: number;
  status: string;
}

export interface ILoanerCarWithAssociations extends ILoanerCar {
  brand?: {
    id: number;
    brandName: string;
  };
  model?: {
    id: number;
    modelName: string;
    brandId: number;
  };
  registration?: {
    id: number;
    registrationName: string;
  };
} 