/*
  Warnings:

  - You are about to drop the `GalleryImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Quote_authorRu_quoteRu_key";

-- DropIndex
DROP INDEX "Quote_author_quote_key";

-- DropIndex
DROP INDEX "ScheduleItem_date_locationRu_key";

-- DropIndex
DROP INDEX "ScheduleItem_date_location_key";


-- DropTable
DROP TABLE "GalleryImage";

-- CreateTable
CREATE TABLE "QuoteAuthor" (
    "id" SERIAL NOT NULL,
    "authorTranslationId" INTEGER NOT NULL,

    CONSTRAINT "QuoteAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleAuthor" (
    "id" SERIAL NOT NULL,
    "authorTranslationId" INTEGER NOT NULL,

    CONSTRAINT "ArticleAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "captionTranslationId" INTEGER NOT NULL,
    "imagePlaceholderImageLink" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" SERIAL NOT NULL,
    "english" TEXT NOT NULL,
    "russian" TEXT,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuoteAuthor" ADD CONSTRAINT "QuoteAuthor_authorTranslationId_fkey" FOREIGN KEY ("authorTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleAuthor" ADD CONSTRAINT "ArticleAuthor_authorTranslationId_fkey" FOREIGN KEY ("authorTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_captionTranslationId_fkey" FOREIGN KEY ("captionTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_imagePlaceholderImageLink_fkey" FOREIGN KEY ("imagePlaceholderImageLink") REFERENCES "ImagePlaceholder"("imageLink") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "DailyGalleryImage" ADD COLUMN     "imagePlaceholderImageLink" TEXT;

-- AddForeignKey
ALTER TABLE "DailyGalleryImage" ADD CONSTRAINT "DailyGalleryImage_imagePlaceholderImageLink_fkey" FOREIGN KEY ("imagePlaceholderImageLink") REFERENCES "ImagePlaceholder"("imageLink") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "NewsArticle" ADD COLUMN     "articleAuthorId" INTEGER,
ADD COLUMN     "authorTranslationId" INTEGER,
ADD COLUMN     "bodyTranslationId" INTEGER,
ADD COLUMN     "imageId" INTEGER,
ADD COLUMN     "snippetTranslationId" INTEGER,
ADD COLUMN     "titleTranslationId" INTEGER;

WITH "articleTitleTranslations" AS (
    INSERT INTO "Translation"(english,russian)
    SELECT DISTINCT "title","titleRu" FROM "NewsArticle"
    RETURNING id, english
)
UPDATE "NewsArticle"
SET "titleTranslationId" = t.id
FROM "articleTitleTranslations" t
WHERE "NewsArticle".title = t.english;

WITH "articleAuthorTranslations" AS (
    INSERT INTO "Translation"(english,russian)
    SELECT DISTINCT "author","authorRu" FROM "NewsArticle"
    RETURNING id, english
)
UPDATE "NewsArticle"
SET "authorTranslationId" = t.id
FROM "articleAuthorTranslations" t
WHERE "NewsArticle".author = t.english;

WITH "articleBodyTranslations" AS (
    INSERT INTO "Translation"(english,russian)
    SELECT DISTINCT "body","bodyRu" FROM "NewsArticle"
    RETURNING id, english
)
UPDATE "NewsArticle"
SET "bodyTranslationId" = t.id
FROM "articleBodyTranslations" t
WHERE "NewsArticle".body = t.english;

WITH "articleSnippetTranslations" AS (
    INSERT INTO "Translation"(english,russian)
    SELECT DISTINCT "snippet","snippetRu" FROM "NewsArticle"
    RETURNING id, english
)
UPDATE "NewsArticle"
SET "snippetTranslationId" = t.id
FROM "articleSnippetTranslations" t
WHERE "NewsArticle".snippet = t.english;

ALTER TABLE "NewsArticle"
    ALTER COLUMN "titleTranslationId" SET NOT NULL,
    ALTER COLUMN "authorTranslationId" SET NOT NULL,
    ALTER COLUMN "bodyTranslationId" SET NOT NULL,
    ALTER COLUMN "snippetTranslationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "authorTranslationId" INTEGER,
ADD COLUMN     "quoteAuthorId" INTEGER,
ADD COLUMN     "quoteTranslationId" INTEGER,
ADD COLUMN     "sourceTranslationId" INTEGER;

WITH "quoteTranslations" AS (
    INSERT INTO "Translation"(english,russian)
    SELECT DISTINCT "quote","quoteRu" FROM "Quote"
    RETURNING id, english
)
UPDATE "Quote"
SET "quoteTranslationId" = t.id
FROM "quoteTranslations" t
WHERE "Quote".quote = t.english;

WITH "quoteAuthorTranslations" AS (
    INSERT INTO "Translation"(english,russian)
    SELECT DISTINCT ON ("author") "author","authorRu" FROM "Quote" ORDER BY "author"
    RETURNING id, english
)
UPDATE "Quote"
SET "authorTranslationId" = t.id
FROM "quoteAuthorTranslations" t
WHERE "Quote".author = t.english;

WITH "quoteSourceTranslations" AS (
    INSERT INTO "Translation"(english,russian)
    SELECT DISTINCT "source","sourceRu" FROM "Quote"
    WHERE "source" IS NOT NULL
    RETURNING id, english
)
UPDATE "Quote"
SET "sourceTranslationId" = t.id
FROM "quoteSourceTranslations" t
WHERE "Quote".source = t.english;

ALTER TABLE "Quote"
    ALTER COLUMN "quoteTranslationId" SET NOT NULL,
    ALTER COLUMN "authorTranslationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ScheduleItem" ADD COLUMN     "titleTranslationId" INTEGER,
ADD COLUMN     "venueTranslationId" INTEGER;

WITH "scheduleItemTitleTranslations" AS (
    INSERT INTO "Translation"(english,russian)
    SELECT DISTINCT "title","titleRu" FROM "ScheduleItem"
    RETURNING id, english
)
UPDATE "ScheduleItem"
SET "titleTranslationId" = t.id
FROM "scheduleItemTitleTranslations" t
WHERE "ScheduleItem".title = t.english;

WITH "scheduleItemVenueTranslations" AS (
    INSERT INTO "Translation"(english,russian)
    SELECT DISTINCT "location","locationRu" FROM "ScheduleItem"
    RETURNING id, english
)
UPDATE "ScheduleItem"
SET "venueTranslationId" = t.id
FROM "scheduleItemVenueTranslations" t
WHERE "ScheduleItem"."location" = t.english;

ALTER TABLE "ScheduleItem"
    ALTER COLUMN "titleTranslationId" SET NOT NULL,
    ALTER COLUMN "venueTranslationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ScheduleItemTime" ADD COLUMN     "designationTranslationId" INTEGER;

WITH "scheduleItemTimeDesignationTranslations" AS (
    INSERT INTO "Translation"(english,russian)
    SELECT DISTINCT "designation","designationRu" FROM "ScheduleItemTime"
    RETURNING id, english
)
UPDATE "ScheduleItemTime"
SET "designationTranslationId" = t.id
FROM "scheduleItemTimeDesignationTranslations" t
WHERE "ScheduleItemTime".designation = t.english;

ALTER TABLE "ScheduleItemTime" ALTER COLUMN "designationTranslationId" SET NOT NULL;

-- -- CreateIndex
-- CREATE UNIQUE INDEX "Translation_english_key" ON "Translation"(md5("english"));

-- -- CreateIndex
-- CREATE UNIQUE INDEX "Translation_russian_key" ON "Translation"(md5("russian"));
