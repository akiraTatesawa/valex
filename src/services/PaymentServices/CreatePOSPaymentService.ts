import { PaymentDTO } from "../../dtos";
import { ServiceExecute } from "../../types/services";
import { IPaymentRepository } from "../../repositories/IPaymentRepository";
import { CardValidator } from "../CardServices/CardValidator";
import { GetBusinessByIdService } from "../BusinessService/GetBusinessByIdService";
import { CustomError } from "../../errors";
import { GetAllRechargesService } from "../RechargeServices/GetAllRechargesService";
import { GetCardBalanceService } from "../CardServices/GetCardBalanceService";
import { Payment } from "../../entities";
import { PaymentMapper } from "../../mappers/PaymentMapper";

interface CreatePOSPaymentRequest {
  cardId: number;
  password: string;
  businessId: number;
  amount: number;
}

export interface CreatePOSPaymentService
  extends ServiceExecute<CreatePOSPaymentRequest, PaymentDTO> {}

export class CreatePOSPaymentServiceImpl implements CreatePOSPaymentService {
  private paymentRepository: IPaymentRepository;

  private cardValidator: CardValidator;

  private getBusinessService: GetBusinessByIdService;

  private getRecharges: GetAllRechargesService;

  private getCardBalance: GetCardBalanceService;

  constructor(
    paymentRepository: IPaymentRepository,
    cardValidator: CardValidator,
    getBusinessService: GetBusinessByIdService,
    getRecharges: GetAllRechargesService,
    getCardBalance: GetCardBalanceService
  ) {
    this.paymentRepository = paymentRepository;
    this.cardValidator = cardValidator;
    this.getBusinessService = getBusinessService;
    this.getRecharges = getRecharges;
    this.getCardBalance = getCardBalance;
  }

  public async execute({
    amount,
    businessId,
    cardId,
    password,
  }: CreatePOSPaymentRequest): Promise<PaymentDTO> {
    const card = await this.cardValidator.validateCardOrFail(cardId);

    this.cardValidator.ensureCardIsActive(card);
    this.cardValidator.validateExpirationDateOrFail(card);
    this.cardValidator.ensureCardIsNotBlocked(card);
    this.cardValidator.validatePasswordOrFail(card, password);

    const business = await this.getBusinessService.execute({ id: businessId });

    if (business.type !== card.type) {
      throw new CustomError(
        "error_unprocessable_entity",
        "Business type and card type must be the same"
      );
    }

    const payments = await this.paymentRepository.findByCardId(cardId);
    const recharges = await this.getRecharges.execute({ cardId });

    const balance = this.getCardBalance.execute({ payments, recharges });

    if (balance - amount < 0) {
      throw new CustomError(
        "error_unprocessable_entity",
        "Insufficient balance"
      );
    }

    const paymentEntity = Payment.create({
      amount,
      businessId,
      cardId,
    });
    const payment = await this.paymentRepository.create(paymentEntity.props);

    return new PaymentMapper().toDTO(payment);
  }
}
