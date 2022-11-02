import { CardValidator } from "../CardValidator";

export class MockCardValidator implements CardValidator {
  ensureCardIsNotActive = jest.fn();

  validateCardOrFail = jest.fn();

  validateExpirationDateOrFail = jest.fn();

  validateSecurityCodeOrFail = jest.fn();

  ensureCardIsActive = jest.fn();

  ensureCardIsNotBlocked = jest.fn();

  validatePasswordOrFail = jest.fn();

  ensureCardIsBlocked = jest.fn();
}
