/*
  Warnings:

  - You are about to drop the column `authorTranslationId` on the `QuoteAuthor` table. All the data in the column will be lost.
  - Added the required column `nameTranslationId` to the `QuoteAuthor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuoteAuthor" DROP CONSTRAINT "QuoteAuthor_authorTranslationId_fkey";

-- AlterTable
ALTER TABLE "QuoteAuthor" RENAME COLUMN "authorTranslationId" TO "nameTranslationId";

-- AddForeignKey
ALTER TABLE "QuoteAuthor" ADD CONSTRAINT "QuoteAuthor_nameTranslationId_fkey" FOREIGN KEY ("nameTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
