/*
  Warnings:

  - You are about to drop the column `customColor` on the `lists` table. All the data in the column will be lost.
  - You are about to drop the column `defaultColor` on the `lists` table. All the data in the column will be lost.
  - Added the required column `color` to the `lists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lists" DROP COLUMN "customColor",
DROP COLUMN "defaultColor",
ADD COLUMN     "color" INTEGER NOT NULL;
