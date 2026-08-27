-- AlterTable
ALTER TABLE "User" ADD COLUMN "isMember" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN "isMentor" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- Backfill from legacy exclusive role
UPDATE "User" SET "isMember" = true, "isMentor" = false, "isAdmin" = false WHERE "role" = 'MEMBER';
UPDATE "User" SET "isMember" = true, "isMentor" = true, "isAdmin" = false WHERE "role" = 'MENTOR';
UPDATE "User" SET "isMember" = true, "isMentor" = true, "isAdmin" = true WHERE "role" = 'ADMIN';
UPDATE "User" SET "isMember" = false, "isMentor" = false, "isAdmin" = false WHERE "role" = 'VISITOR';
