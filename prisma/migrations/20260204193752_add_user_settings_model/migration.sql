/*
  Warnings:

  - You are about to drop the `historics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "historics" DROP CONSTRAINT "historics_userId_fkey";

-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "lists" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "historics";

-- DropEnum
DROP TYPE "HistoricItemType";

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trashRetentionDays" INTEGER NOT NULL DEFAULT 15,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");
