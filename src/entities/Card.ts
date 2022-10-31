import { randCreditCardNumber, randCreditCardCVV } from "@ngneat/falso";
import dayjs from "dayjs";
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

  public static create({ cardholderName, employeeId, type }: CreateCardProps) {
    if (cardholderName.length === 0) {
      throw new CustomError(
        "error_internal_server_error",
        "Cardholder Name cannot be empty"
      );
    }

    const cardNumber = randCreditCardNumber();
    const securityCode = randCreditCardCVV();
    const expirationDate = dayjs().add(7, "year").format("MM/YY");

    return new Card({
      cardholderName,
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
