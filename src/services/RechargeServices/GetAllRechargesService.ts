import { RechargeDTO } from "../../dtos";
import { ServiceExecute } from "../../types/services";
import { IRechargeRepository } from "../../repositories/IRechargeRepository";
import { RechargeMapper } from "../../mappers";

interface GetAllRechargesRequest {
  cardId: number;
}

export interface GetAllRechargesService
  extends ServiceExecute<GetAllRechargesRequest, RechargeDTO[]> {}

export class GetAllRechargesServiceImpl implements GetAllRechargesService {
  private rechargeRepository: IRechargeRepository;

  constructor(rechargeRepository: IRechargeRepository) {
    this.rechargeRepository = rechargeRepository;
  }

  public async execute({
    cardId,
  }: GetAllRechargesRequest): Promise<RechargeDTO[]> {
    const recharges = await this.rechargeRepository.findByCardId(cardId);

    const rechargesDTO = recharges.map((recharge) =>
      new RechargeMapper().toDTO(recharge)
    );

    return rechargesDTO;
  }
}
