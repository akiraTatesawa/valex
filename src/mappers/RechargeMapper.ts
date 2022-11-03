import { Recharge as PrismaRecharge } from "@prisma/client";
import dayjs from "dayjs";
import { Mapper } from "./Mapper";
import { RechargeDTO } from "../dtos/RechargeDTO";

export class RechargeMapper extends Mapper<PrismaRecharge, RechargeDTO> {
  public toDTO({ id, amount, cardId, timestamp }: PrismaRecharge): RechargeDTO {
    const formattedTimestamp = dayjs(timestamp).format("DD/MM/YYYY");

    return {
      id,
      amount,
      cardId,
      timestamp: formattedTimestamp,
    };
  }
}
