import { Card as PrismaCard } from "@prisma/client";
import { randFullName, randNumber } from "@ngneat/falso";
import { Card } from "../../entities/Card";

type PartialCardProps = Partial<PrismaCard>;

export class CardFactory {
  public createCard({ ...props }: PartialCardProps = {}): PrismaCard {
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

    return card;
  }
}
