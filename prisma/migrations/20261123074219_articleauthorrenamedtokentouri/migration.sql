/*
  Warnings:

  - You are about to drop the column `token` on the `ArticleAuthor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ArticleAuthor" DROP COLUMN "token",
ADD COLUMN     "uri" TEXT NOT NULL DEFAULT gen_random_uuid();
