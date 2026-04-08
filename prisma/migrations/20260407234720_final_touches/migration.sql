/*
  Warnings:

  - The primary key for the `FeaturedArticle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `newsArticleId` on the `FeaturedArticle` table. All the data in the column will be lost.
  - You are about to drop the `NewsArticle` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `articleId` to the `FeaturedArticle` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FeaturedArticle" DROP CONSTRAINT "FeaturedArticle_newsArticleId_fkey";

-- DropForeignKey
ALTER TABLE "NewsArticle" DROP CONSTRAINT "NewsArticle_articleAuthorId_fkey";

-- DropForeignKey
ALTER TABLE "NewsArticle" DROP CONSTRAINT "NewsArticle_bodyTranslationId_fkey";

-- DropForeignKey
ALTER TABLE "NewsArticle" DROP CONSTRAINT "NewsArticle_imageId_fkey";

-- DropForeignKey
ALTER TABLE "NewsArticle" DROP CONSTRAINT "NewsArticle_snippetTranslationId_fkey";

-- DropForeignKey
ALTER TABLE "NewsArticle" DROP CONSTRAINT "NewsArticle_titleTranslationId_fkey";

-- AlterTable
ALTER TABLE "FeaturedArticle" DROP CONSTRAINT "FeaturedArticle_pkey";
ALTER TABLE "FeaturedArticle" RENAME COLUMN "newsArticleId" TO "articleId";
ALTER TABLE "FeaturedArticle" ADD CONSTRAINT "FeaturedArticle_pkey" PRIMARY KEY ("articleId");

-- DropTable
ALTER TABLE "NewsArticle" RENAME TO "Article";

-- CreateIndex
CREATE UNIQUE INDEX "Article_link_key" ON "Article"("link");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_titleTranslationId_fkey" FOREIGN KEY ("titleTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_bodyTranslationId_fkey" FOREIGN KEY ("bodyTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_snippetTranslationId_fkey" FOREIGN KEY ("snippetTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_articleAuthorId_fkey" FOREIGN KEY ("articleAuthorId") REFERENCES "ArticleAuthor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedArticle" ADD CONSTRAINT "FeaturedArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
