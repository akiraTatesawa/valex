import { IRechargeRepository } from "../IRechargeRepository";

export class MockRechargeRepository implements IRechargeRepository {
  create = jest.fn();
}
