import { ServiceExecute } from "../../types/services";
import { RechargeDTO, PaymentDTO } from "../../dtos";
import { CardValidator } from "./CardValidator";
import { GetCardBalanceService } from "./GetCardBalanceService";
import { GetAllPaymentsService } from "../PaymentServices/GetAllPaymentsService";
import { GetAllRechargesService } from "../RechargeServices/GetAllRechargesService";

interface GetCardStatementRequest {
  cardId: number;
}

export interface Statement {
  balance: number;
  recharges: RechargeDTO[];
  payments: PaymentDTO[];
}

export interface GetCardStatementService
  extends ServiceExecute<GetCardStatementRequest, Statement> {}

export class GetCardStatementServiceImpl implements GetCardStatementService {
  private cardValidator: CardValidator;

  private getBalanceService: GetCardBalanceService;

  private getPayments: GetAllPaymentsService;

  private getRecharges: GetAllRechargesService;

  constructor(
    cardValidator: CardValidator,
    getBalanceService: GetCardBalanceService,
    getPayments: GetAllPaymentsService,
    getRecharges: GetAllRechargesService
  ) {
    this.cardValidator = cardValidator;
    this.getBalanceService = getBalanceService;
    this.getPayments = getPayments;
    this.getRecharges = getRecharges;
  }

  public async execute({
    cardId,
  }: GetCardStatementRequest): Promise<Statement> {
    await this.cardValidator.validateCardOrFail(cardId);

    const payments = await this.getPayments.execute({ cardId });
    const recharges = await this.getRecharges.execute({ cardId });
    const balance = this.getBalanceService.execute({ payments, recharges });

    return {
      balance,
      recharges,
      payments,
    };
  }
}
