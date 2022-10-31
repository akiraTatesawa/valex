import { ICardRepository } from "../ICardRepository";

export class MockCardRepository implements ICardRepository {
  create = jest.fn();

  findByTypeAndEmployeeId = jest.fn();
}
