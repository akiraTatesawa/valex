import bcrypt from "bcrypt";
import { ICardRepository } from "../../repositories/ICardRepository";
import { ServiceExecute } from "../../types/services";
import { CardValidator } from "./CardValidator";

interface ActivateCardRequest {
  id: number;
  password: string;
  securityCode: string;
}

export interface ActivateCardService
  extends ServiceExecute<ActivateCardRequest, void> {}

export class ActivateCardServiceImpl implements ActivateCardService {
  private cardRepository: ICardRepository;

  private cardValidator: CardValidator;

  constructor(cardRepository: ICardRepository, cardValidator: CardValidator) {
    this.cardRepository = cardRepository;
    this.cardValidator = cardValidator;
  }

  private encryptPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  public async execute({
    id,
    password,
    securityCode,
  }: ActivateCardRequest): Promise<void> {
    const card = await this.cardValidator.validateCardOrFail(id);

    this.cardValidator.validateExpirationDateOrFail(card);
    this.cardValidator.ensureCardIsNotActive(card);
    this.cardValidator.validateSecurityCodeOrFail(card, securityCode);

    const hashedPassword = this.encryptPassword(password);

    await this.cardRepository.activate(id, hashedPassword);
  }
}
