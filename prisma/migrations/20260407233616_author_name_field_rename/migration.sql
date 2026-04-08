/*
  Warnings:

  - You are about to drop the column `authorTranslationId` on the `ArticleAuthor` table. All the data in the column will be lost.
  - Added the required column `nameTranslationId` to the `ArticleAuthor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArticleAuthor" DROP CONSTRAINT "ArticleAuthor_authorTranslationId_fkey";

-- AlterTable
ALTER TABLE "ArticleAuthor" RENAME COLUMN "authorTranslationId" TO "nameTranslationId";

-- AddForeignKey
ALTER TABLE "ArticleAuthor" ADD CONSTRAINT "ArticleAuthor_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
