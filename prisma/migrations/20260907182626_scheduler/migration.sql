/*
  Warnings:

  - You are about to drop the `RemovedScheduleItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduleItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduleItemTime` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RemovedScheduleItem" DROP CONSTRAINT "RemovedScheduleItem_scheduleItemId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleItem" DROP CONSTRAINT "ScheduleItem_titleTranslationId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleItem" DROP CONSTRAINT "ScheduleItem_venueTranslationId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleItemTime" DROP CONSTRAINT "ScheduleItemTime_designationTranslationId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleItemTime" DROP CONSTRAINT "ScheduleItemTime_scheduleItemId_fkey";

-- DropTable
DROP TABLE "RemovedScheduleItem";

-- DropTable
DROP TABLE "ScheduleItem";

-- DropTable
DROP TABLE "ScheduleItemTime";

-- CreateTable
CREATE TABLE "InstantaneousScheduleItem" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "titleTranslationId" INTEGER NOT NULL,
    "venueTranslationId" INTEGER NOT NULL,

    CONSTRAINT "InstantaneousScheduleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringScheduleItem" (
    "id" SERIAL NOT NULL,
    "pattern" TEXT NOT NULL,
    "titleTranslationId" INTEGER NOT NULL,
    "venueTranslationId" INTEGER NOT NULL,

    CONSTRAINT "RecurringScheduleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstantaneousScheduleItemTime" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMPTZ NOT NULL,
    "designationTranslationId" INTEGER NOT NULL,
    "instantaneousScheduleItemId" INTEGER NOT NULL,

    CONSTRAINT "InstantaneousScheduleItemTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringScheduleItemTime" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMPTZ NOT NULL,
    "designationTranslationId" INTEGER NOT NULL,
    "recurringScheduleItemId" INTEGER NOT NULL,

    CONSTRAINT "RecurringScheduleItemTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RemovedInstantaneousScheduleItem" (
    "instantaneousScheduleItemId" INTEGER NOT NULL,

    CONSTRAINT "RemovedInstantaneousScheduleItem_pkey" PRIMARY KEY ("instantaneousScheduleItemId")
);

-- CreateTable
CREATE TABLE "DisabledRecurringScheduleItem" (
    "recurringScheduleItemId" INTEGER NOT NULL,

    CONSTRAINT "DisabledRecurringScheduleItem_pkey" PRIMARY KEY ("recurringScheduleItemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstantaneousScheduleItem_venueTranslationId_date_key" ON "InstantaneousScheduleItem"("venueTranslationId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "RecurringScheduleItem_venueTranslationId_pattern_key" ON "RecurringScheduleItem"("venueTranslationId", "pattern");

-- CreateIndex
CREATE UNIQUE INDEX "InstantaneousScheduleItemTime_designationTranslationId_time_key" ON "InstantaneousScheduleItemTime"("designationTranslationId", "time");

-- CreateIndex
CREATE UNIQUE INDEX "RecurringScheduleItemTime_designationTranslationId_time_key" ON "RecurringScheduleItemTime"("designationTranslationId", "time");

-- AddForeignKey
ALTER TABLE "InstantaneousScheduleItem" ADD CONSTRAINT "InstantaneousScheduleItem_titleTranslationId_fkey" FOREIGN KEY ("titleTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstantaneousScheduleItem" ADD CONSTRAINT "InstantaneousScheduleItem_venueTranslationId_fkey" FOREIGN KEY ("venueTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringScheduleItem" ADD CONSTRAINT "RecurringScheduleItem_titleTranslationId_fkey" FOREIGN KEY ("titleTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringScheduleItem" ADD CONSTRAINT "RecurringScheduleItem_venueTranslationId_fkey" FOREIGN KEY ("venueTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstantaneousScheduleItemTime" ADD CONSTRAINT "InstantaneousScheduleItemTime_designationTranslationId_fkey" FOREIGN KEY ("designationTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstantaneousScheduleItemTime" ADD CONSTRAINT "InstantaneousScheduleItemTime_instantaneousScheduleItemId_fkey" FOREIGN KEY ("instantaneousScheduleItemId") REFERENCES "InstantaneousScheduleItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringScheduleItemTime" ADD CONSTRAINT "RecurringScheduleItemTime_designationTranslationId_fkey" FOREIGN KEY ("designationTranslationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringScheduleItemTime" ADD CONSTRAINT "RecurringScheduleItemTime_recurringScheduleItemId_fkey" FOREIGN KEY ("recurringScheduleItemId") REFERENCES "RecurringScheduleItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemovedInstantaneousScheduleItem" ADD CONSTRAINT "RemovedInstantaneousScheduleItem_instantaneousScheduleItem_fkey" FOREIGN KEY ("instantaneousScheduleItemId") REFERENCES "InstantaneousScheduleItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisabledRecurringScheduleItem" ADD CONSTRAINT "DisabledRecurringScheduleItem_recurringScheduleItemId_fkey" FOREIGN KEY ("recurringScheduleItemId") REFERENCES "RecurringScheduleItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
