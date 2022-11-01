import { CardFactory } from "../../src/services/CardServices/CardFactory";
import { CompanyFactory } from "../../src/services/CompanyServices/CompanyFactory";
import { EmployeeFactory } from "../../src/services/EmployeeServices/EmployeeFactory";
import { CardScenarios } from "./CardScenarios";

export function cardScenariosFactory() {
  const cardFactory = new CardFactory();
  const companyFactory = new CompanyFactory();
  const employeeFactory = new EmployeeFactory();

  return new CardScenarios(cardFactory, companyFactory, employeeFactory);
}
