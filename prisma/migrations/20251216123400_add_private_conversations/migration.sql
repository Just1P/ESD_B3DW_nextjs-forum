/*
  Warnings:

  - Made the column `userId` on table `conversation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `conversation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conversationId` on table `message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "conversation" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "message" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "conversationId" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "verification" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "conversation_participant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conversation_participant_userId_conversationId_key" ON "conversation_participant"("userId", "conversationId");

-- AddForeignKey
ALTER TABLE "conversation_participant" ADD CONSTRAINT "conversation_participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participant" ADD CONSTRAINT "conversation_participant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
