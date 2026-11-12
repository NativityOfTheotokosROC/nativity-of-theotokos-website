/*
  Warnings:

  - You are about to drop the column `dateCreated` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article"
RENAME COLUMN "dateCreated" TO "datePublished";

ALTER TABLE "Article";
ALTER COLUMN "datePublished" TYPE TIMESTAMPTZ
USING "datePublished" AT TIME ZONE 'Africa/Harare'

-- CreateTable
CREATE TABLE "RemovedArticle" (
    "articleId" INTEGER NOT NULL,

    CONSTRAINT "RemovedArticle_pkey" PRIMARY KEY ("articleId")
);

-- AddForeignKey
ALTER TABLE "RemovedArticle" ADD CONSTRAINT "RemovedArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
