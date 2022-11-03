import { Business } from "@prisma/client";

export interface IBusinessRepository {
  findById(id: number): Promise<Business | null>;
}
