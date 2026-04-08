/*
  Warnings:

  - A unique constraint covering the columns `[nameTranslationId]` on the table `ArticleAuthor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quoteTranslationId]` on the table `Quote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nameTranslationId]` on the table `QuoteAuthor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ArticleAuthor_nameTranslationId_key" ON "ArticleAuthor"("nameTranslationId");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_quoteTranslationId_key" ON "Quote"("quoteTranslationId");

-- CreateIndex
CREATE UNIQUE INDEX "QuoteAuthor_nameTranslationId_key" ON "QuoteAuthor"("nameTranslationId");
