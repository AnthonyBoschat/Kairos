/*
  Warnings:

  - You are about to drop the column `templateId` on the `lists` table. All the data in the column will be lost.
  - You are about to drop the `templates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "lists" DROP CONSTRAINT "lists_templateId_fkey";

-- AlterTable
ALTER TABLE "lists" DROP COLUMN "templateId",
ADD COLUMN     "template" TEXT;

-- DropTable
DROP TABLE "templates";
