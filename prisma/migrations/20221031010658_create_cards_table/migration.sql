-- CreateTable
CREATE TABLE "cards" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "number" TEXT NOT NULL,
    "cardholderName" TEXT NOT NULL,
    "securityCode" TEXT NOT NULL,
    "expirationDate" TEXT NOT NULL,
    "password" TEXT,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "isVirtual" BOOLEAN NOT NULL DEFAULT false,
    "type" "BusinessType" NOT NULL,
    "originalCardId" INTEGER,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_originalCardId_fkey" FOREIGN KEY ("originalCardId") REFERENCES "cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
