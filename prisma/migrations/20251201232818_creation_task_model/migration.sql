-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "listId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tasks_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
