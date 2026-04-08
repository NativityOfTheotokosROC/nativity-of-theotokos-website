/*
  Warnings:

  - You are about to drop the column `imagePlaceholderImageLink` on the `DailyGalleryImage` table. All the data in the column will be lost.
  - You are about to drop the column `imagePlaceholderImageLink` on the `Image` table. All the data in the column will be lost.
  - The primary key for the `ImagePlaceholder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[link]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageLink]` on the table `ImagePlaceholder` will be added. If there are existing duplicate values, this will fail.

*/

-- DropForeignKey
ALTER TABLE "DailyGalleryImage" DROP CONSTRAINT "DailyGalleryImage_imagePlaceholderImageLink_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_imagePlaceholderImageLink_fkey";

-- AlterTable
ALTER TABLE "DailyGalleryImage" DROP COLUMN "imagePlaceholderImageLink",
ADD COLUMN     "imagePlaceholderId" INTEGER;

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "imagePlaceholderImageLink",
ADD COLUMN     "imagePlaceholderId" INTEGER;

-- AlterTable
ALTER TABLE "ImagePlaceholder" DROP CONSTRAINT "ImagePlaceholder_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ImagePlaceholder_pkey" PRIMARY KEY ("id");

WITH "placeholders" AS (
    SELECT "id", "imageLink" FROM "ImagePlaceholder"
)
UPDATE "Image"
SET "imagePlaceholderId" = p."id"
FROM "placeholders" p
WHERE p."imageLink" = "Image"."link";

WITH "placeholders" AS (
    SELECT "id", "imageLink" FROM "ImagePlaceholder"
)
UPDATE "DailyGalleryImage"
SET "imagePlaceholderId" = p."id"
FROM "placeholders" p
WHERE p."imageLink" = "DailyGalleryImage"."imageLink";

-- CreateIndex
CREATE UNIQUE INDEX "Image_link_key" ON "Image"("link");

-- CreateIndex
CREATE UNIQUE INDEX "ImagePlaceholder_imageLink_key" ON "ImagePlaceholder"("imageLink");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_imagePlaceholderId_fkey" FOREIGN KEY ("imagePlaceholderId") REFERENCES "ImagePlaceholder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyGalleryImage" ADD CONSTRAINT "DailyGalleryImage_imagePlaceholderId_fkey" FOREIGN KEY ("imagePlaceholderId") REFERENCES "ImagePlaceholder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
