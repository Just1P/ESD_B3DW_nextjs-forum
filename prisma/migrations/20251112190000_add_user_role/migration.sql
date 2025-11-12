-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODERATOR', 'USER');

-- AlterTable
ALTER TABLE "user"
ADD COLUMN "role" "Role" NOT NULL DEFAULT 'USER';

-- Update existing rows to ensure the default applies
UPDATE "user" SET "role" = 'USER' WHERE "role" IS NULL;

