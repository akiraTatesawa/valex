// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";
import httpStatus from "http-status";
import { TestHelpers } from "../helpers";
import { close, init, app } from "../../src/app";
import { PaymentScenarios } from "../scenarios/PaymentScenarios";

describe("POST /payments/pos", () => {
  beforeEach(async () => {
    await new TestHelpers().cleanDB();
    await init();
  });

  afterEach(async () => {
    await close();
  });

  const server = supertest(app);
  const paymentScenarios = new PaymentScenarios();

  it("[201]: Should be able to create a POS Payment", async () => {
    const { business, prismaCard, recharge, password } =
      await paymentScenarios.createPayment();

    const response = await server.post("/payments/pos").send({
      cardId: prismaCard.id,
      password,
      businessId: business.id,
      amount: recharge.amount - 1,
    });

    expect(response.statusCode).toEqual(httpStatus.CREATED);
    expect(response.body).toHaveProperty("id");
  });

  it("[422]: Should not be able to create a POS Payment if the business type does not match the card type", async () => {
    const { business, prismaCard, recharge, password } =
      await paymentScenarios.createPayment("groceries");

    const response = await server.post("/payments/pos").send({
      cardId: prismaCard.id,
      password,
      businessId: business.id,
      amount: recharge.amount - 1,
    });

    expect(response.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
    expect(response.body).toHaveProperty(
      "message",
      "Business type and card type must be the same"
    );
  });

  it("[422]: Should not be able to create a POS Payment if the balance is insufficient", async () => {
    const { business, prismaCard, recharge, password } =
      await paymentScenarios.createPayment();

    const response = await server.post("/payments/pos").send({
      cardId: prismaCard.id,
      password,
      businessId: business.id,
      amount: recharge.amount + 1,
    });

    expect(response.statusCode).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
    expect(response.body).toHaveProperty("message", "Insufficient balance");
  });

  it("[400]: Should not be able to create a POS Payment if body is invalid", async () => {
    const { business, prismaCard, recharge, password } =
      await paymentScenarios.createPayment();

    const response = await server.post("/payments/pos").send({
      cardId: prismaCard.id,
      password,
      businessId: business.id,
      amount: recharge.amount - 1,
      invalid: "invalid",
    });

    expect(response.statusCode).toEqual(httpStatus.BAD_REQUEST);
    expect(response.body).toHaveProperty("message");
  });

  it("[404]: Should not be able to create a POS Payment if business does not exist", async () => {
    const { business, prismaCard, recharge, password } =
      await paymentScenarios.createPayment();

    const response = await server.post("/payments/pos").send({
      cardId: prismaCard.id,
      password,
      businessId: business.id + 1,
      amount: recharge.amount - 1,
    });

    expect(response.statusCode).toEqual(httpStatus.NOT_FOUND);
    expect(response.body).toHaveProperty("message", "Business not found");
  });
});
