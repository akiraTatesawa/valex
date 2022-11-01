import { Card as PrismaCard } from "@prisma/client";
import { randFullName, randNumber } from "@ngneat/falso";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";
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

  public createActiveCard({ ...props }: PartialCardProps = {}) {
    const cardEntity = Card.create({
      cardholderName: randFullName(),
      employeeId: randNumber(),
      type: "education",
    });

    const password = "1234";

    const card: PrismaCard = {
      id: randNumber(),
      ...cardEntity.props,
      password: bcrypt.hashSync(password, 10),
      ...props,
    };

    const CVV = this.cryptr.decrypt(card.securityCode);

    return { card, password, CVV };
  }
}
