/*
  Warnings:

  - You are about to drop the column `translationId` on the `ArticleAuthorProfile` table. All the data in the column will be lost.
  - Added the required column `descriptionTranslationId` to the `ArticleAuthorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArticleAuthorProfile" DROP CONSTRAINT "ArticleAuthorProfile_translationId_fkey";

-- AlterTable
ALTER TABLE "ArticleAuthorProfile" DROP COLUMN "translationId",
ADD COLUMN     "descriptionTranslationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ArticleAuthorProfile" ADD CONSTRAINT "ArticleAuthorProfile_descriptionTranslationId_fkey" FOREIGN KEY ("descriptionTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
