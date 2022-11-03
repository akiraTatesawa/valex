import { Card } from "@prisma/client";
import Cryptr from "cryptr";
import { CardDTO } from "../dtos";
import { Mapper } from "./Mapper";

export class CardMapper extends Mapper<Card, CardDTO> {
  public toDTO(card: Card): CardDTO {
    const cryptr = new Cryptr(`${process.env.CRYPTR_SECRET}`);

    return {
      id: card.id,
      cardholderName: card.cardholderName,
      expirationDate: card.expirationDate,
      number: card.number,
      securityCode: cryptr.decrypt(card.securityCode),
      type: card.type,
    };
  }
}
