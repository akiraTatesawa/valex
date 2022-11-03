// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";
import httpStatus from "http-status";
import { TestHelpers } from "../helpers";
import { app, close, init } from "../../src/app";
import { PaymentScenarios } from "../scenarios/PaymentScenarios";

describe("GET /cards/:id/statement", () => {
  beforeEach(async () => {
    await new TestHelpers().cleanDB();
    await init();
  });

  afterEach(async () => {
    await close();
  });

  const server = supertest(app);
  const paymentScenario = new PaymentScenarios();

  it("[200]: Should be able to get the card statement", async () => {
    const { prismaCard } = await paymentScenario.createStatementScenario();

    const response = await server.get(`/cards/${prismaCard.id}/statement`);

    expect(response.statusCode).toEqual(httpStatus.OK);
    expect(response.body).toHaveProperty("balance");
    expect(response.body).toHaveProperty("recharges");
    expect(response.body).toHaveProperty("payments");
  });
});
