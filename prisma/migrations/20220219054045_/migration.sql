/*
  Warnings:

  - You are about to drop the column `oauthId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[oauthUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `oauthUserId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_oauthId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "oauthId",
ADD COLUMN     "oauthUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_oauthUserId_key" ON "User"("oauthUserId");
