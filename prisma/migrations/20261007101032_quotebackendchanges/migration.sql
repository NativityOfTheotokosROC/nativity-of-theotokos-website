-- DropForeignKey
ALTER TABLE "DailyQuote" DROP CONSTRAINT "DailyQuote_quoteId_fkey";

-- AddForeignKey
ALTER TABLE "DailyQuote" ADD CONSTRAINT "DailyQuote_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
