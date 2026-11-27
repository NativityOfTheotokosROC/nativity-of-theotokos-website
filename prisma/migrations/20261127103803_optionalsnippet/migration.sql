-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_snippetTranslationId_fkey";

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "snippetTranslationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_snippetTranslationId_fkey" FOREIGN KEY ("snippetTranslationId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
