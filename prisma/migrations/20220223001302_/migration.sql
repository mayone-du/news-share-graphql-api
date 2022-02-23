/*
  Warnings:

  - A unique constraint covering the columns `[newsId,userId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Like_newsId_key";

-- DropIndex
DROP INDEX "Like_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Like_newsId_userId_key" ON "Like"("newsId", "userId");
