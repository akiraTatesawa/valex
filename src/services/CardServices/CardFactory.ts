import { Card as PrismaCard } from "@prisma/client";
import { randFullName, randNumber } from "@ngneat/falso";
import Cryptr from "cryptr";
import { Card } from "../../entities/Card";

type PartialCardProps = Partial<PrismaCard>;

export class CardFactory {
  private cryptr: Cryptr;

  constructor() {
    this.cryptr = new Cryptr(`${process.env.CRYPTR_SECRET}`);
  }

  public createCard({ ...props }: PartialCardProps = {}) {
    const cardEntity = Card.create({
      cardholderName: randFullName(),
      employeeId: randNumber(),
      type: "education",
    });

    const card: PrismaCard = {
      id: randNumber(),
      ...cardEntity.props,
      ...props,
    };

    const CVV = this.cryptr.decrypt(card.securityCode);

    return { card, CVV };
  }
}
