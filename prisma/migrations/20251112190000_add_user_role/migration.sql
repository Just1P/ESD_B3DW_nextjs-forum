-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODERATOR', 'USER');

-- AlterTable
ALTER TABLE "user"
ADD COLUMN "role" "Role" NOT NULL DEFAULT 'USER';

