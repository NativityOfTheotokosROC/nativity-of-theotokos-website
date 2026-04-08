/*
  Warnings:

  - You are about to drop the column `articleAuthorId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `imagePlaceholderId` on the `ArticleImage` table. All the data in the column will be lost.
  - You are about to drop the column `imageLink` on the `DailyGalleryImage` table. All the data in the column will be lost.
  - You are about to drop the column `imagePlaceholderId` on the `DailyGalleryImage` table. All the data in the column will be lost.
  - You are about to drop the column `quoteAuthorId` on the `Quote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[date,link]` on the table `DailyGalleryImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `DailyGalleryImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_articleAuthorId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleImage" DROP CONSTRAINT "ArticleImage_imagePlaceholderId_fkey";

-- DropForeignKey
ALTER TABLE "DailyGalleryImage" DROP CONSTRAINT "DailyGalleryImage_imagePlaceholderId_fkey";

-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_quoteAuthorId_fkey";

-- DropIndex
DROP INDEX "DailyGalleryImage_date_imageLink_key";

-- AlterTable
ALTER TABLE "Article" RENAME COLUMN "articleAuthorId" TO "authorId";

-- AlterTable
ALTER TABLE "ArticleImage" RENAME COLUMN "imagePlaceholderId" TO "placeholderId";

-- AlterTable
ALTER TABLE "DailyGalleryImage" RENAME COLUMN "imageLink" TO "link";
ALTER TABLE "DailyGalleryImage" RENAME COLUMN "imagePlaceholderId" TO "placeholderId";

-- AlterTable
ALTER TABLE "Quote" RENAME COLUMN "quoteAuthorId" TO "authorId";

-- CreateIndex
CREATE UNIQUE INDEX "DailyGalleryImage_date_link_key" ON "DailyGalleryImage"("date", "link");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "QuoteAuthor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "ArticleAuthor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleImage" ADD CONSTRAINT "ArticleImage_placeholderId_fkey" FOREIGN KEY ("placeholderId") REFERENCES "ImagePlaceholder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyGalleryImage" ADD CONSTRAINT "DailyGalleryImage_placeholderId_fkey" FOREIGN KEY ("placeholderId") REFERENCES "ImagePlaceholder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
