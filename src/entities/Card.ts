import { randCreditCardNumber, randCreditCardCVV } from "@ngneat/falso";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import { CustomError } from "../errors";

import { BusinessType } from "../types/business";
import { Entity } from "./Entity";

interface CardProps {
  employeeId: number;
  cardholderName: string;
  type: BusinessType;
  number: string;
  securityCode: string;
  expirationDate: string;
  password: string | null;
  originalCardId: number | null;
  isVirtual: boolean;
  isBlocked: boolean;
}

type CreateCardProps = Pick<
  CardProps,
  "cardholderName" | "employeeId" | "type"
>;

export class Card extends Entity<CardProps> {
  private constructor(props: CardProps) {
    super(props);
  }

  private static formatCardholderName(cardholderName: string): string {
    const employeeNameArray: string[] = cardholderName.split(" ");
    const cardholderNameArray: string[] = [];

    employeeNameArray.forEach((value, index, array) => {
      if (index === 0 || index === array.length - 1) {
        return cardholderNameArray.push(value.toUpperCase());
      }
      if (value.length > 3) {
        return cardholderNameArray.push(value.charAt(0).toUpperCase());
      }
      return null;
    });

    return cardholderNameArray.join(" ");
  }

  public static create({ cardholderName, employeeId, type }: CreateCardProps) {
    if (cardholderName.length === 0) {
      throw new CustomError(
        "error_internal_server_error",
        "Cardholder Name cannot be empty"
      );
    }

    const cryptr = new Cryptr(`${process.env.CRYPTR_SECRET}`);

    const formattedCardholderName = this.formatCardholderName(cardholderName);
    const cardNumber = randCreditCardNumber();
    const securityCode = cryptr.encrypt(randCreditCardCVV());
    const expirationDate = dayjs().add(7, "year").format("MM/YY");

    return new Card({
      cardholderName: formattedCardholderName,
      employeeId,
      type,
      number: cardNumber,
      securityCode,
      expirationDate,
      password: null,
      isBlocked: false,
      isVirtual: false,
      originalCardId: null,
    });
  }
}
