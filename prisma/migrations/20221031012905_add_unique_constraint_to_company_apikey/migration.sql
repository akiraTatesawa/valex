/*
  Warnings:

  - A unique constraint covering the columns `[apikey]` on the table `companies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "companies_apikey_key" ON "companies"("apikey");
