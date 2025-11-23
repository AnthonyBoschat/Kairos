-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_lists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "countElement" BOOLEAN NOT NULL DEFAULT true,
    "defaultColor" INTEGER,
    "customColor" TEXT,
    "order" INTEGER NOT NULL,
    "folderId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "lists_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_lists" ("createdAt", "customColor", "defaultColor", "favorite", "folderId", "id", "order", "title", "updatedAt") SELECT "createdAt", "customColor", "defaultColor", "favorite", "folderId", "id", "order", "title", "updatedAt" FROM "lists";
DROP TABLE "lists";
ALTER TABLE "new_lists" RENAME TO "lists";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
