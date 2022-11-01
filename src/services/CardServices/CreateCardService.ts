import { Card as PrismaCard } from "@prisma/client";
import Cryptr from "cryptr";
import { ServiceExecute } from "../../types/services";
import { BusinessType } from "../../types/business";
import { GetCompanyService } from "../CompanyServices/GetCompanyService";
import { GetEmployeeService } from "../EmployeeServices/GetEmployeeService";
import { ICardRepository } from "../../repositories/ICardRepository";
import { CustomError } from "../../errors";
import { Card } from "../../entities/Card";

interface CreateCardRequest {
  apikey: string;
  type: BusinessType;
  employeeId: number;
}

type ValidateCardType = Omit<CreateCardRequest, "apikey">;

type CreateCardResponse = Pick<
  PrismaCard,
  | "id"
  | "cardholderName"
  | "number"
  | "securityCode"
  | "expirationDate"
  | "type"
>;

export interface CreateCardService
  extends ServiceExecute<CreateCardRequest, CreateCardResponse> {}

export class CreateCardServiceImpl implements CreateCardService {
  private cardRepository: ICardRepository;

  private validateCompany: GetCompanyService;

  private validateEmployee: GetEmployeeService;

  constructor(
    cardRepository: ICardRepository,
    validateCompany: GetCompanyService,
    validateEmployee: GetEmployeeService
  ) {
    this.cardRepository = cardRepository;
    this.validateCompany = validateCompany;
    this.validateEmployee = validateEmployee;
  }

  private async validateUniqueCardType({
    employeeId,
    type,
  }: ValidateCardType): Promise<void> {
    const card = await this.cardRepository.findByTypeAndEmployeeId(
      type,
      employeeId
    );

    if (card) {
      throw new CustomError(
        "error_conflict",
        `The employee already has a ${type} voucher card`
      );
    }
  }

  private sanitizeCard(card: PrismaCard): CreateCardResponse {
    const cryptr = new Cryptr(`${process.env.CRYPTR_SECRET}`);

    return {
      id: card.id,
      cardholderName: card.cardholderName,
      expirationDate: card.expirationDate,
      number: card.number,
      securityCode: cryptr.decrypt(card.securityCode),
      type: card.type,
    };
  }

  public async execute({
    apikey,
    employeeId,
    type,
  }: CreateCardRequest): Promise<CreateCardResponse> {
    // Validate Company by APIKEY or fail
    await this.validateCompany.execute({ apiKey: apikey });

    // Validate Employee by employeeId or fail
    const employee = await this.validateEmployee.execute({
      id: employeeId,
    });

    // Validate if Employee already has a card with the same type
    await this.validateUniqueCardType({ employeeId, type });

    const newCard = Card.create({
      cardholderName: employee.fullName,
      employeeId,
      type,
    });

    const prismaCard = await this.cardRepository.create(newCard.props);

    return this.sanitizeCard(prismaCard);
  }
}
