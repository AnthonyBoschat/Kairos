/*
  Warnings:

  - You are about to drop the column `action` on the `historics` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `historics` table. All the data in the column will be lost.
  - Changed the type of `item` on the `historics` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "HistoricAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- AlterTable
ALTER TABLE "historics" DROP COLUMN "action",
DROP COLUMN "itemId",
ADD COLUMN     "delete" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "item",
ADD COLUMN     "item" JSONB NOT NULL;
