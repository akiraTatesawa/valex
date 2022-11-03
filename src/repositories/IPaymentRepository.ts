import { Business, Payment } from "@prisma/client";

export type CreatePaymentData = Omit<Payment, "id">;

export interface PaymentWithBusiness extends Omit<Payment, "businessId"> {
  business: Business;
}

export interface IPaymentRepository {
  create(data: CreatePaymentData): Promise<PaymentWithBusiness>;
  findByCardId(cardId: number): Promise<PaymentWithBusiness[]>;
}
