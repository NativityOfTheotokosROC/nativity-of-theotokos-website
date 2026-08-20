/*
  Warnings:

  - You are about to drop the column `userEmail` on the `ArticleTicket` table. All the data in the column will be lost.
  - Added the required column `assigneeEmail` to the `ArticleTicket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArticleTicket" DROP COLUMN "userEmail",
ADD COLUMN     "assigneeEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ArticleTicket" ADD CONSTRAINT "ArticleTicket_assigneeEmail_fkey" FOREIGN KEY ("assigneeEmail") REFERENCES "ArticleAuthor"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
