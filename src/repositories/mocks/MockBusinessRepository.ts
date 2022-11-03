import { IBusinessRepository } from "../IBusinessRepository";

export class MockBusinessRepository implements IBusinessRepository {
  findById = jest.fn();
}
