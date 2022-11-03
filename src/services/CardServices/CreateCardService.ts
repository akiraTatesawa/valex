import { ServiceExecute } from "../../types/services";
import { BusinessType } from "../../types/business";
import { GetCompanyService } from "../CompanyServices/GetCompanyService";
import { GetEmployeeService } from "../EmployeeServices/GetEmployeeService";
import { ICardRepository } from "../../repositories/ICardRepository";
import { CustomError } from "../../errors";
import { Card } from "../../entities/Card";
import { CardDTO } from "../../dtos";
import { CardMapper } from "../../mappers";

interface CreateCardRequest {
  apikey: string;
  type: BusinessType;
  employeeId: number;
}

type ValidateCardType = Omit<CreateCardRequest, "apikey">;

type CreateCardResponse = CardDTO;

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

  public async execute({
    apikey,
    employeeId,
    type,
  }: CreateCardRequest): Promise<CardDTO> {
    await this.validateCompany.execute({ apiKey: apikey });

    const employee = await this.validateEmployee.execute({
      id: employeeId,
    });

    await this.validateUniqueCardType({ employeeId, type });

    const newCard = Card.create({
      cardholderName: employee.fullName,
      employeeId,
      type,
    });

    const prismaCard = await this.cardRepository.create(newCard.props);

    return new CardMapper().toDTO(prismaCard);
  }
}
