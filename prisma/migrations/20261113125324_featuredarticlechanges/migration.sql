/*
  Warnings:

  - Made the column `placeholderId` on table `ArticleImage` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ArticleImage" DROP CONSTRAINT "ArticleImage_placeholderId_fkey";

-- AlterTable
ALTER TABLE "ArticleImage" ALTER COLUMN "placeholderId" SET NOT NULL;

-- AlterTable
ALTER TABLE "FeaturedArticle" ADD COLUMN     "dateFeatured" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "ArticleImage" ADD CONSTRAINT "ArticleImage_placeholderId_fkey" FOREIGN KEY ("placeholderId") REFERENCES "ImagePlaceholder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
