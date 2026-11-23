-- AlterTable
ALTER TABLE "ArticleAuthor" ADD COLUMN     "token" TEXT NOT NULL DEFAULT gen_random_uuid();
