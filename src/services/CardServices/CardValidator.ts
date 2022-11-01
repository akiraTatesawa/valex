import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { Card as PrismaCard } from "@prisma/client";
import Cryptr from "cryptr";
import { ICardRepository } from "../../repositories/ICardRepository";
import { CustomError } from "../../errors/index";

dayjs.extend(isSameOrAfter);
dayjs.extend(customParseFormat);

export interface CardValidator {
  validateCardOrFail(id: number): Promise<PrismaCard>;
  validateExpirationDateOrFail(card: PrismaCard): void;
  ensureCardIsNotActive(card: PrismaCard): void;
  validateSecurityCodeOrFail(card: PrismaCard, cvv: string): void;
}

export class CardValidatorImpl implements CardValidator {
  private repository: ICardRepository;

  constructor(repository: ICardRepository) {
    this.repository = repository;
  }

  public async validateCardOrFail(id: number): Promise<PrismaCard> {
    const card = await this.repository.findById(id);

    if (!card) {
      throw new CustomError("error_not_found", "Card not found");
    }

    return card;
  }

  validateExpirationDateOrFail({ expirationDate }: PrismaCard): void {
    const isExpired = dayjs().isSameOrAfter(dayjs(expirationDate, "MM/YY"));

    if (isExpired) {
      throw new CustomError(
        "error_unprocessable_entity",
        "The card is expired"
      );
    }
  }

  ensureCardIsNotActive({ password }: PrismaCard): void {
    if (password) {
      throw new CustomError(
        "error_unprocessable_entity",
        "The card is already active"
      );
    }
  }

  validateSecurityCodeOrFail({ securityCode }: PrismaCard, cvv: string): void {
    const cryptr = new Cryptr(`${process.env.CRYPTR_SECRET}`);

    const decryptedCVV = cryptr.decrypt(securityCode);

    if (decryptedCVV !== cvv) {
      throw new CustomError("error_unauthorized", "Wrong CVV");
    }
  }
}