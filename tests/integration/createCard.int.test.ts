// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from "supertest";
import httpStatus from "http-status";
import { init, app, close } from "../../src/app";
import { TestHelpers } from "../helpers";
import { cardScenariosFactory } from "../scenarios";

describe("POST /cards", () => {
  beforeEach(async () => {
    await new TestHelpers().cleanDB();
    await init();
  });

  afterEach(async () => {
    await close();
  });

  const server = supertest(app);
  const cardScenarios = cardScenariosFactory();

  it("[201]: Should be able to create a card", async () => {
    const { createCardData, headers } =
      await cardScenarios.createCardScenario();

    const response = await server
      .post("/cards")
      .send(createCardData)
      .set(headers);

    expect(response.statusCode).toEqual(httpStatus.CREATED);
    expect(response.body).toHaveProperty("id");
  });

  it("[409]: Should not be able to create a card if the employee already has one with the same type", async () => {
    const { createCardData, headers } =
      await cardScenarios.conflictCardScenario();

    const response = await server
      .post("/cards")
      .send(createCardData)
      .set(headers);

    expect(response.statusCode).toEqual(httpStatus.CONFLICT);
    expect(response.body).toHaveProperty(
      "message",
      `The employee already has a ${createCardData.type} voucher card`
    );
  });

  it("[404]: Should not be able to create a card if company does not exist", async () => {
    const { createCardData } = await cardScenarios.createCardScenario();

    const response = await server.post("/cards").send(createCardData).set({
      "x-api-key": "12345",
    });

    expect(response.statusCode).toEqual(httpStatus.NOT_FOUND);
    expect(response.body).toHaveProperty("message", "Company not found");
  });

  it("[404]: Should not be able to create a card if employee does not exist", async () => {
    const { createCardData, headers } =
      await cardScenarios.createCardScenario();

    const response = await server
      .post("/cards")
      .send({ ...createCardData, employeeId: 90 })
      .set(headers);

    expect(response.statusCode).toEqual(httpStatus.NOT_FOUND);
    expect(response.body).toHaveProperty("message", "Employee not found");
  });

  it("[422]: Should not be able to create a card if apikey is invalid", async () => {
    const createCardData = { employeeId: 1, type: "education" };

    const response = await server.post("/cards").send(createCardData).set({
      "x-api-key": "",
    });

    expect(response.statusCode).toEqual(httpStatus.BAD_REQUEST);
    expect(response.body).toHaveProperty("message");
  });

  it("[422]: Should not be able to create a card if body is invalid", async () => {
    const createCardData = {
      employeeId: 1,
      type: "education",
      invalid: "invalid",
    };

    const response = await server.post("/cards").send(createCardData).set({
      "x-api-key": "1235",
    });

    expect(response.statusCode).toEqual(httpStatus.BAD_REQUEST);
    expect(response.body).toHaveProperty("message");
  });
});
