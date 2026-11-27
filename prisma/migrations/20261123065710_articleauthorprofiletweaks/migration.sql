-- DropForeignKey
ALTER TABLE "ArticleAuthorProfile" DROP CONSTRAINT "ArticleAuthorProfile_descriptionTranslationId_fkey";

-- AlterTable
ALTER TABLE "ArticleAuthorProfile" ALTER COLUMN "descriptionTranslationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ArticleAuthorProfile" ADD CONSTRAINT "ArticleAuthorProfile_descriptionTranslationId_fkey" FOREIGN KEY ("descriptionTranslationId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
