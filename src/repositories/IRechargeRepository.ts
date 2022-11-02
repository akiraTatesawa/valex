import { Recharge } from "@prisma/client";

export type CreateRechargeData = Omit<Recharge, "id">;

export interface IRechargeRepository {
  create(data: CreateRechargeData): Promise<Recharge>;
}
