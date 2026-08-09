/*
  Warnings:

  - A unique constraint covering the columns `[articleId]` on the table `ArticleTicket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ArticleTicket_articleId_key" ON "ArticleTicket"("articleId");
