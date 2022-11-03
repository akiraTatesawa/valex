import { BusinessType } from "../types/business";

export interface CardDTO {
  id: number;
  cardholderName: string;
  number: string;
  expirationDate: string;
  securityCode: string;
  type: BusinessType;
}
