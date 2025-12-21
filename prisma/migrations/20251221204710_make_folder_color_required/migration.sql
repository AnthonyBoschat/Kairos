/*
  Warnings:

  - Made the column `color` on table `folders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "folders" ALTER COLUMN "color" SET NOT NULL;
