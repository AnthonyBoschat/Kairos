/*
  Warnings:

  - You are about to alter the column `color` on the `folders` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_folders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "color" INTEGER,
    "customColor" TEXT,
    "order" INTEGER NOT NULL,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "showProgression" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_folders" ("color", "createdAt", "favorite", "id", "order", "showProgression", "title", "updatedAt", "userId") SELECT "color", "createdAt", "favorite", "id", "order", "showProgression", "title", "updatedAt", "userId" FROM "folders";
DROP TABLE "folders";
ALTER TABLE "new_folders" RENAME TO "folders";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
