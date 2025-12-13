/*
  Warnings:

  - You are about to alter the column `title` on the `tasks` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "content" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);
