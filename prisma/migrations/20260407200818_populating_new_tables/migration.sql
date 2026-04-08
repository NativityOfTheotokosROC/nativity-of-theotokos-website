/*
  Warnings:

  - You are about to drop the column `author` on the `NewsArticle` table. All the data in the column will be lost.
  - You are about to drop the column `authorRu` on the `NewsArticle` table. All the data in the column will be lost.
  - You are about to drop the column `imageCaption` on the `NewsArticle` table. All the data in the column will be lost.
  - You are about to drop the column `imageLink` on the `NewsArticle` table. All the data in the column will be lost.
  - Made the column `articleAuthorId` on table `NewsArticle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageId` on table `NewsArticle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quoteAuthorId` on table `Quote` required. This step will fail if there are existing NULL values in that column.

*/

WITH "articleAuthors" AS (
  INSERT INTO "ArticleAuthor"("authorTranslationId")
  SELECT DISTINCT "authorTranslationId" FROM "NewsArticle"
  RETURNING id, "authorTranslationId"
)
UPDATE "NewsArticle"
SET "articleAuthorId" = t.id
FROM "articleAuthors" t
WHERE "NewsArticle"."authorTranslationId" = t."authorTranslationId";

WITH "articleImageCaptionTranslations" AS (
  INSERT INTO "Translation"(english)
  SELECT DISTINCT "imageCaption" FROM "NewsArticle"
  RETURNING id, "english"
),
"articleImages" AS (
  INSERT INTO "Image"("link", "captionTranslationId")
  SELECT DISTINCT "imageLink", t.id 
  FROM "NewsArticle" n
  JOIN "articleImageCaptionTranslations" t
  ON n."imageCaption" = t.english
  RETURNING id, "link"
)
UPDATE "NewsArticle"
SET "imageId" = i.id
FROM "articleImages" i
WHERE "NewsArticle"."imageLink" = i."link";

-- AlterTable
ALTER TABLE "NewsArticle" DROP COLUMN "author",
DROP COLUMN "authorRu",
DROP COLUMN "imageCaption",
DROP COLUMN "imageLink",
ALTER COLUMN "articleAuthorId" SET NOT NULL,
ALTER COLUMN "imageId" SET NOT NULL;

WITH "quoteAuthorTranslations" AS (
  INSERT INTO "QuoteAuthor"("authorTranslationId")
  SELECT DISTINCT "authorTranslationId" FROM "Quote"
  RETURNING id, "authorTranslationId"
)
UPDATE "Quote"
SET "quoteAuthorId" = t.id
FROM "quoteAuthorTranslations" t
WHERE "Quote"."authorTranslationId" = t."authorTranslationId";

-- AlterTable
ALTER TABLE "Quote" ALTER COLUMN "quoteAuthorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_quoteAuthorId_fkey" FOREIGN KEY ("quoteAuthorId") REFERENCES "QuoteAuthor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsArticle" ADD CONSTRAINT "NewsArticle_articleAuthorId_fkey" FOREIGN KEY ("articleAuthorId") REFERENCES "ArticleAuthor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsArticle" ADD CONSTRAINT "NewsArticle_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
