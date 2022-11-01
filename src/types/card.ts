import { BusinessType } from "./business";

export interface CreateCardRequestBody {
  employeeId: number;
  type: BusinessType;
}
