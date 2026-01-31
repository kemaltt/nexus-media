-- CreateEnum
CREATE TYPE "SocialAccountStatus" AS ENUM ('ACTIVE', 'NEEDS_REAUTH', 'REVOKED', 'PENDING_REVIEW');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('BEARER', 'USER_CONTEXT', 'OAUTH1A');

-- AlterTable
ALTER TABLE "SocialAccount" ADD COLUMN     "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "scopes" TEXT[],
ADD COLUMN     "status" "SocialAccountStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "tokenType" "TokenType" NOT NULL DEFAULT 'BEARER';
