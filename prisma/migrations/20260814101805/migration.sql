/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `ArticleAuthor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ArticleAuthor_email_key" ON "ArticleAuthor"("email");
