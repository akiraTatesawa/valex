/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,type]` on the table `cards` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cards_employeeId_type_key" ON "cards"("employeeId", "type");
