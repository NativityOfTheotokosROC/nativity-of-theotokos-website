-- DropForeignKey
ALTER TABLE "ArticleTicket" DROP CONSTRAINT "ArticleTicket_articleId_fkey";

-- AlterTable
ALTER TABLE "ArticleTicket" ALTER COLUMN "articleId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "ArticleTicket" ADD CONSTRAINT "ArticleTicket_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("link") ON DELETE SET NULL ON UPDATE CASCADE;
