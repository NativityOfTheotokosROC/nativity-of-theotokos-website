-- AlterTable
ALTER TABLE "ArticleAuthor" ADD COLUMN     "email" TEXT;

-- CreateTable
CREATE TABLE "ArticleTicket" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "articleId" INTEGER,

    CONSTRAINT "ArticleTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleDraft" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "lastSaved" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "articleTicketId" TEXT NOT NULL,

    CONSTRAINT "ArticleDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingArticleSubmission" (
    "articleDraftId" INTEGER NOT NULL,

    CONSTRAINT "PendingArticleSubmission_pkey" PRIMARY KEY ("articleDraftId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleDraft_articleTicketId_key" ON "ArticleDraft"("articleTicketId");

-- AddForeignKey
ALTER TABLE "ArticleTicket" ADD CONSTRAINT "ArticleTicket_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleDraft" ADD CONSTRAINT "ArticleDraft_articleTicketId_fkey" FOREIGN KEY ("articleTicketId") REFERENCES "ArticleTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingArticleSubmission" ADD CONSTRAINT "PendingArticleSubmission_articleDraftId_fkey" FOREIGN KEY ("articleDraftId") REFERENCES "ArticleDraft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
