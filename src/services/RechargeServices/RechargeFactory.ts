import { Recharge as PrismaRecharge } from "@prisma/client";
import { randNumber } from "@ngneat/falso";

type PartialPrismaRecharge = Partial<PrismaRecharge>;

export class RechargeFactory {
  public generate({ ...props }: PartialPrismaRecharge = {}): PrismaRecharge {
    return {
      amount: randNumber({ min: 1 }),
      cardId: randNumber(),
      id: randNumber(),
      timestamp: new Date(),
      ...props,
    };
  }
}
