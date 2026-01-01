-- CreateEnum
CREATE TYPE "HistoricItem" AS ENUM ('FOLDER', 'LIST', 'TASK');

-- CreateTable
CREATE TABLE "historics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "item" "HistoricItem" NOT NULL,
    "itemId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "historics" ADD CONSTRAINT "historics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
