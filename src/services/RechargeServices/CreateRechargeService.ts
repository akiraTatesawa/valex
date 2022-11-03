import { ServiceExecute } from "../../types/services";
import { IRechargeRepository } from "../../repositories/IRechargeRepository";
import { CardValidator } from "../CardServices/CardValidator";
import { RechargeDTO } from "../../dtos";
import { Recharge } from "../../entities";
import { RechargeMapper } from "../../mappers";
import { GetCompanyService } from "../CompanyServices/GetCompanyService";

interface CreateRechargeRequest {
  amount: number;
  cardId: number;
  apikey: string;
}

export interface CreateRechargeService
  extends ServiceExecute<CreateRechargeRequest, RechargeDTO> {}

export class CreateRechargeServiceImpl implements CreateRechargeService {
  private rechargeRepository: IRechargeRepository;

  private cardValidator: CardValidator;

  private companyValidator: GetCompanyService;

  constructor(
    rechargeRepository: IRechargeRepository,
    cardValidator: CardValidator,
    companyValidator: GetCompanyService
  ) {
    this.rechargeRepository = rechargeRepository;
    this.cardValidator = cardValidator;
    this.companyValidator = companyValidator;
  }

  async execute({
    amount,
    cardId,
    apikey,
  }: CreateRechargeRequest): Promise<RechargeDTO> {
    await this.companyValidator.execute({ apiKey: apikey });

    const card = await this.cardValidator.validateCardOrFail(cardId);

    this.cardValidator.ensureCardIsActive(card);
    this.cardValidator.validateExpirationDateOrFail(card);

    const rechargeEntity = Recharge.create({
      amount,
      cardId,
    });

    const rechargeDB = await this.rechargeRepository.create(
      rechargeEntity.props
    );

    return new RechargeMapper().toDTO(rechargeDB);
  }
}
