/*
  Warnings:

  - You are about to drop the column `body` on the `NewsArticle` table. All the data in the column will be lost.
  - You are about to drop the column `bodyRu` on the `NewsArticle` table. All the data in the column will be lost.
  - You are about to drop the column `snippet` on the `NewsArticle` table. All the data in the column will be lost.
  - You are about to drop the column `snippetRu` on the `NewsArticle` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `NewsArticle` table. All the data in the column will be lost.
  - You are about to drop the column `titleRu` on the `NewsArticle` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `authorRu` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `quote` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `quoteRu` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `sourceRu` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `ScheduleItem` table. All the data in the column will be lost.
  - You are about to drop the column `locationRu` on the `ScheduleItem` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `ScheduleItem` table. All the data in the column will be lost.
  - You are about to drop the column `titleRu` on the `ScheduleItem` table. All the data in the column will be lost.
  - You are about to drop the column `designation` on the `ScheduleItemTime` table. All the data in the column will be lost.
  - You are about to drop the column `designationRu` on the `ScheduleItemTime` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NewsArticle" DROP COLUMN "body",
DROP COLUMN "bodyRu",
DROP COLUMN "snippet",
DROP COLUMN "snippetRu",
DROP COLUMN "title",
DROP COLUMN "titleRu";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "author",
DROP COLUMN "authorRu",
DROP COLUMN "quote",
DROP COLUMN "quoteRu",
DROP COLUMN "source",
DROP COLUMN "sourceRu";

-- AlterTable
ALTER TABLE "ScheduleItem" DROP COLUMN "location",
DROP COLUMN "locationRu",
DROP COLUMN "title",
DROP COLUMN "titleRu";

-- AlterTable
ALTER TABLE "ScheduleItemTime" DROP COLUMN "designation",
DROP COLUMN "designationRu";

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_quoteTranslationId_fkey" FOREIGN KEY ("quoteTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_sourceTranslationId_fkey" FOREIGN KEY ("sourceTranslationId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleItem" ADD CONSTRAINT "ScheduleItem_titleTranslationId_fkey" FOREIGN KEY ("titleTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleItem" ADD CONSTRAINT "ScheduleItem_venueTranslationId_fkey" FOREIGN KEY ("venueTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleItemTime" ADD CONSTRAINT "ScheduleItemTime_designationTranslationId_fkey" FOREIGN KEY ("designationTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsArticle" ADD CONSTRAINT "NewsArticle_titleTranslationId_fkey" FOREIGN KEY ("titleTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsArticle" ADD CONSTRAINT "NewsArticle_bodyTranslationId_fkey" FOREIGN KEY ("bodyTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsArticle" ADD CONSTRAINT "NewsArticle_snippetTranslationId_fkey" FOREIGN KEY ("snippetTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
