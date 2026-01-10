/*
  Warnings:

  - You are about to drop the column `day` on the `DailyQuote` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "DailyQuote_day_key";

-- AlterTable
ALTER TABLE "DailyQuote" DROP COLUMN "day",
ADD COLUMN     "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "DailyQuote_pkey" PRIMARY KEY ("date");
