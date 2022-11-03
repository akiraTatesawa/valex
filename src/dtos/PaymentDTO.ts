import { Business } from "@prisma/client";

export interface PaymentDTO {
  id: number;
  cardId: number;
  business: Business;
  timestamp: string;
  amount: number;
}
