import { ServiceExecute } from "../../types/services";
import { IRechargeRepository } from "../../repositories/IRechargeRepository";
import { CardValidator } from "../CardServices/CardValidator";
import { RechargeMapper } from "../../mappers/RechargeMapper";
import { RechargeDTO } from "../../dtos/RechargeDTO";
import { Recharge } from "../../entities/Recharge";

interface CreateRechargeRequest {
  amount: number;
  cardId: number;
}

export interface CreateRechargeService
  extends ServiceExecute<CreateRechargeRequest, RechargeDTO> {}

export class CreateRechargeServiceImpl implements CreateRechargeService {
  private rechargeRepository: IRechargeRepository;

  private cardValidator: CardValidator;

  constructor(
    rechargeRepository: IRechargeRepository,
    cardValidator: CardValidator
  ) {
    this.rechargeRepository = rechargeRepository;
    this.cardValidator = cardValidator;
  }

  async execute({
    amount,
    cardId,
  }: CreateRechargeRequest): Promise<RechargeDTO> {
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
