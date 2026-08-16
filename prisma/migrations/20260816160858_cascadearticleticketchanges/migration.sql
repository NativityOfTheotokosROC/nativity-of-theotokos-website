-- DropForeignKey
ALTER TABLE "ArticleDraft" DROP CONSTRAINT "ArticleDraft_articleTicketId_fkey";

-- DropForeignKey
ALTER TABLE "PendingArticleSubmission" DROP CONSTRAINT "PendingArticleSubmission_articleDraftId_fkey";

-- AddForeignKey
ALTER TABLE "ArticleDraft" ADD CONSTRAINT "ArticleDraft_articleTicketId_fkey" FOREIGN KEY ("articleTicketId") REFERENCES "ArticleTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingArticleSubmission" ADD CONSTRAINT "PendingArticleSubmission_articleDraftId_fkey" FOREIGN KEY ("articleDraftId") REFERENCES "ArticleDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;
