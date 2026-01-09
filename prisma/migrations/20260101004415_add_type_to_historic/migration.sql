/*
  Warnings:

  - Added the required column `itemType` to the `historics` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HistoricItemType" AS ENUM ('FOLDER', 'LIST', 'TASK');

-- AlterTable
ALTER TABLE "historics" ADD COLUMN     "itemType" "HistoricItemType" NOT NULL;

-- DropEnum
DROP TYPE "HistoricAction";

-- DropEnum
DROP TYPE "HistoricItem";
