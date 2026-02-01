-- AlterTable
ALTER TABLE "lists" ADD COLUMN     "checkable" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT false;
