import { ICardRepository } from "../../repositories/ICardRepository";
import { ServiceExecute } from "../../types/services";
import { CardValidator } from "./CardValidator";

interface BlockCardRequest {
  id: number;
  password: string;
}

export interface BlockCardService
  extends ServiceExecute<BlockCardRequest, void> {}

export class BlockCardServiceImpl implements BlockCardService {
  private cardRepository: ICardRepository;

  private cardValidator: CardValidator;

  constructor(cardRepository: ICardRepository, cardValidator: CardValidator) {
    this.cardRepository = cardRepository;
    this.cardValidator = cardValidator;
  }

  public async execute({ id, password }: BlockCardRequest): Promise<void> {
    const card = await this.cardValidator.validateCardOrFail(id);

    this.cardValidator.ensureCardIsActive(card);
    this.cardValidator.validateExpirationDateOrFail(card);
    this.cardValidator.ensureCardIsNotBlocked(card);
    this.cardValidator.validatePasswordOrFail(card, password);

    await this.cardRepository.block(id);
  }
}
