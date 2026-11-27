/*
  Warnings:

  - A unique constraint covering the columns `[uri]` on the table `ArticleAuthor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ArticleAuthor_uri_key" ON "ArticleAuthor"("uri");
