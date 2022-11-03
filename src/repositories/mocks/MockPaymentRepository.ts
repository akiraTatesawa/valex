import { IPaymentRepository } from "../IPaymentRepository";

export class MockPaymentRepository implements IPaymentRepository {
  create = jest.fn();

  findByCardId = jest.fn();
}
