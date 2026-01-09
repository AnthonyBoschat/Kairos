/*
  Warnings:

  - Added the required column `itemID` to the `historics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "historics" ADD COLUMN     "itemID" TEXT NOT NULL;
