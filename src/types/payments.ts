export interface POSPaymentRequestBody {
  cardId: number;
  password: string;
  businessId: number;
  amount: number;
}
