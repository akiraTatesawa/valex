import { BusinessType } from "./business";

export interface CreateCardRequestBody {
  employeeId: number;
  type: BusinessType;
}

export interface ActivateCardRequestBody {
  password: string;
  securityCode: string;
}

export interface BlockUnblockCardRequestBody {
  password: string;
}
