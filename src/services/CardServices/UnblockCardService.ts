import { ServiceExecute } from "../../types/services";
import { CardValidator } from "./CardValidator";
import { ICardRepository } from "../../repositories/ICardRepository";

interface UnblockCardRequest {
  id: number;
  password: string;
}

export interface UnblockCardService
  extends ServiceExecute<UnblockCardRequest, void> {}

export class UnblockCardServiceImpl implements UnblockCardService {
  private cardValidator: CardValidator;

  private cardRepository: ICardRepository;

  constructor(cardValidator: CardValidator, cardRepository: ICardRepository) {
    this.cardValidator = cardValidator;
    this.cardRepository = cardRepository;
  }

  public async execute({ id, password }: UnblockCardRequest): Promise<void> {
    const card = await this.cardValidator.validateCardOrFail(id);

    this.cardValidator.ensureCardIsActive(card);
    this.cardValidator.validateExpirationDateOrFail(card);
    this.cardValidator.ensureCardIsBlocked(card);
    this.cardValidator.validatePasswordOrFail(card, password);

    await this.cardRepository.unblock(id);
  }
}
