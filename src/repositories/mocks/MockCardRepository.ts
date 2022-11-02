import { ICardRepository } from "../ICardRepository";

export class MockCardRepository implements ICardRepository {
  activate = jest.fn();

  findById = jest.fn();

  create = jest.fn();

  findByTypeAndEmployeeId = jest.fn();

  block = jest.fn();

  unblock = jest.fn();
}
