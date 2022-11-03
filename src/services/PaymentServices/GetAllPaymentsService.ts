import { PaymentDTO } from "../../dtos";
import { ServiceExecute } from "../../types/services";
import { IPaymentRepository } from "../../repositories/IPaymentRepository";
import { PaymentMapper } from "../../mappers";

interface GetAllPaymentsRequest {
  cardId: number;
}

export interface GetAllPaymentsService
  extends ServiceExecute<GetAllPaymentsRequest, PaymentDTO[]> {}

export class GetAllPaymentsServiceImpl implements GetAllPaymentsService {
  private paymentRepository: IPaymentRepository;

  constructor(paymentRepository: IPaymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  public async execute({
    cardId,
  }: GetAllPaymentsRequest): Promise<PaymentDTO[]> {
    const payments = await this.paymentRepository.findByCardId(cardId);

    return payments.map((payment) => new PaymentMapper().toDTO(payment));
  }
}
