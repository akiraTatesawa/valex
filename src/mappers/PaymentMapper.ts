import dayjs from "dayjs";
import { PaymentDTO } from "../dtos";
import { PaymentWithBusiness } from "../repositories/IPaymentRepository";
import { Mapper } from "./Mapper";

export class PaymentMapper extends Mapper<PaymentWithBusiness, PaymentDTO> {
  public toDTO({ timestamp, ...props }: PaymentWithBusiness): PaymentDTO {
    return {
      ...props,
      timestamp: dayjs(timestamp).format("DD/MM/YYYY"),
    };
  }
}
