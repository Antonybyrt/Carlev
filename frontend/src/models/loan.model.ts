export interface ILoan {
  id?: number;
  loanerCarId: number;
  orNumber: number;
  customerId: number;
  startDate: Date;
  endDate: Date;
  notes: string;
}

export interface ILoanWithAssociations extends ILoan {
  loanerCar?: {
    id: number;
    carBrandId: number;
    carModelId: number;
    registrationId: number;
    status: string;
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
  };
  customer?: {
    id: number;
    firstName: string;
    lastName: string;
    loginId: number;
  };
} 