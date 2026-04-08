/*
  Warnings:

  - You are about to drop the column `authorTranslationId` on the `NewsArticle` table. All the data in the column will be lost.
  - You are about to drop the column `authorTranslationId` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NewsArticle" DROP COLUMN "authorTranslationId";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "authorTranslationId";
