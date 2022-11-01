import {
  randBrand,
  randCompanyName,
  randEmail,
  randFullName,
  randNumber,
} from "@ngneat/falso";
import { PrismaClient } from "@prisma/client";
import { Company } from "../src/entities/Company";
import { Employee } from "../src/entities/Employee";
import { Business } from "../src/entities/Business";
import { BusinessType } from "../src/types/business";

class Seed {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private generateEmployee(companyId: number) {
    return Employee.create({
      fullName: randFullName(),
      cpf: randNumber({ length: 11 }).toString(),
      email: randEmail(),
      companyId,
    }).props;
  }

  private generateBusiness(type: BusinessType) {
    return Business.create({
      name: randBrand() + randCompanyName(),
      type,
    }).props;
  }

  public async main(): Promise<void> {
    try {
      console.log("\nConnecting with database...");
      await this.prisma.$connect();

      console.log("\nTruncating tables...");
      await this.prisma
        .$queryRaw`TRUNCATE TABLE companies RESTART IDENTITY CASCADE`;
      await this.prisma
        .$queryRaw`TRUNCATE TABLE employees RESTART IDENTITY CASCADE`;
      await this.prisma
        .$queryRaw`TRUNCATE TABLE businesses RESTART IDENTITY CASCADE`;
      await this.prisma
        .$queryRaw`TRUNCATE TABLE cards RESTART IDENTITY CASCADE`;

      console.log("\nCreating company...");
      const companyEntity = Company.create({ name: randCompanyName() });
      const { id: companyId } = await this.prisma.company.create({
        data: companyEntity.props,
      });

      console.log("Creating employees...");
      const employees = [
        this.generateEmployee(companyId),
        this.generateEmployee(companyId),
      ];
      await this.prisma.employee.createMany({
        data: employees,
      });

      console.log("Creating businesses...");
      const businesses = [
        this.generateBusiness("education"),
        this.generateBusiness("groceries"),
        this.generateBusiness("health"),
        this.generateBusiness("restaurants"),
        this.generateBusiness("transport"),
      ];
      await this.prisma.business.createMany({
        data: businesses,
      });

      console.log("\nOK!");
    } catch (error) {
      console.error(error);

      process.exit(1);
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

new Seed().main();
