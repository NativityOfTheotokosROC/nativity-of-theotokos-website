/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_imageId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_captionTranslationId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_imagePlaceholderId_fkey";

-- Rename Table
ALTER TABLE "Image" RENAME TO "ArticleImage";

ALTER TABLE "ArticleImage" RENAME CONSTRAINT "Image_pkey" TO "ArticleImage_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "ArticleImage_link_key" ON "ArticleImage"("link");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "ArticleImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleImage" ADD CONSTRAINT "ArticleImage_captionTranslationId_fkey" FOREIGN KEY ("captionTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleImage" ADD CONSTRAINT "ArticleImage_imagePlaceholderId_fkey" FOREIGN KEY ("imagePlaceholderId") REFERENCES "ImagePlaceholder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
