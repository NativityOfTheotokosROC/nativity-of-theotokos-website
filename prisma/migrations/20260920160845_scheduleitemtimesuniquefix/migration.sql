/*
  Warnings:

  - A unique constraint covering the columns `[instantaneousScheduleItemId,designationTranslationId,time]` on the table `InstantaneousScheduleItemTime` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recurringScheduleItemId,designationTranslationId,time]` on the table `RecurringScheduleItemTime` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "RecurringScheduleItemTime" DROP CONSTRAINT "RecurringScheduleItemTime_recurringScheduleItemId_fkey";

-- DropIndex
DROP INDEX "InstantaneousScheduleItemTime_designationTranslationId_time_key";

-- DropIndex
DROP INDEX "RecurringScheduleItemTime_designationTranslationId_time_key";

-- CreateIndex
CREATE UNIQUE INDEX "InstantaneousScheduleItemTime_instantaneousScheduleItemId_d_key" ON "InstantaneousScheduleItemTime"("instantaneousScheduleItemId", "designationTranslationId", "time");

-- CreateIndex
CREATE UNIQUE INDEX "RecurringScheduleItemTime_recurringScheduleItemId_designati_key" ON "RecurringScheduleItemTime"("recurringScheduleItemId", "designationTranslationId", "time");

-- AddForeignKey
ALTER TABLE "RecurringScheduleItemTime" ADD CONSTRAINT "RecurringScheduleItemTime_recurringScheduleItemId_fkey" FOREIGN KEY ("recurringScheduleItemId") REFERENCES "RecurringScheduleItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
