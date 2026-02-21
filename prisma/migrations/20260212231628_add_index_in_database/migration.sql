-- CreateIndex
CREATE INDEX "folders_userId_idx" ON "folders"("userId");

-- CreateIndex
CREATE INDEX "folders_userId_deletedAt_order_idx" ON "folders"("userId", "deletedAt", "order");

-- CreateIndex
CREATE INDEX "folders_userId_deletedAt_favorite_idx" ON "folders"("userId", "deletedAt", "favorite");

-- CreateIndex
CREATE INDEX "lists_folderId_deletedAt_order_idx" ON "lists"("folderId", "deletedAt", "order");

-- CreateIndex
CREATE INDEX "lists_folderId_deletedAt_favorite_idx" ON "lists"("folderId", "deletedAt", "favorite");

-- CreateIndex
CREATE INDEX "tasks_listId_deletedAt_order_idx" ON "tasks"("listId", "deletedAt", "order");

-- CreateIndex
CREATE INDEX "tasks_listId_deletedAt_done_idx" ON "tasks"("listId", "deletedAt", "done");

-- CreateIndex
CREATE INDEX "tasks_listId_deletedAt_favorite_idx" ON "tasks"("listId", "deletedAt", "favorite");
