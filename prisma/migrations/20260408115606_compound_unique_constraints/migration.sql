/*
  Warnings:

  - A unique constraint covering the columns `[date,venueTranslationId]` on the table `ScheduleItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ScheduleItem_date_venueTranslationId_key" ON "ScheduleItem"("date", "venueTranslationId");
