import { PrismaClient } from "@prisma/client";

export class TestHelpers {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async cleanDB() {
    await this.prisma.$connect();

    await this.prisma
      .$queryRaw`TRUNCATE TABLE companies RESTART IDENTITY CASCADE`;
    await this.prisma
      .$queryRaw`TRUNCATE TABLE employees RESTART IDENTITY CASCADE`;
    await this.prisma
      .$queryRaw`TRUNCATE TABLE businesses RESTART IDENTITY CASCADE`;
    await this.prisma.$queryRaw`TRUNCATE TABLE cards RESTART IDENTITY CASCADE`;

    await this.prisma.$disconnect();
  }
}
