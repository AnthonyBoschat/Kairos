/*
  Warnings:

  - You are about to drop the column `customColor` on the `folders` table. All the data in the column will be lost.
  - You are about to drop the column `defaultColor` on the `folders` table. All the data in the column will be lost.
  - You are about to drop the `colors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "colors" DROP CONSTRAINT "colors_userId_fkey";

-- AlterTable
ALTER TABLE "folders" DROP COLUMN "customColor",
DROP COLUMN "defaultColor",
ADD COLUMN     "color" INTEGER;

-- DropTable
DROP TABLE "colors";
