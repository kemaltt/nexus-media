/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleLoginEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "passwordChangeCode" TEXT,
ADD COLUMN     "passwordChangeExpires" TIMESTAMP(3),
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
