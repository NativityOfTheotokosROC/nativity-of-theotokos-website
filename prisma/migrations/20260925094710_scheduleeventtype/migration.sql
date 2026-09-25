-- AlterTable
ALTER TABLE "InstantaneousScheduleItem" ADD COLUMN     "eventTypeName" TEXT NOT NULL DEFAULT 'normal';

-- AlterTable
ALTER TABLE "RecurringScheduleItem" ADD COLUMN     "eventTypeName" TEXT NOT NULL DEFAULT 'normal';

-- CreateTable
CREATE TABLE "EventType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EventType_pkey" PRIMARY KEY ("id")
);

--Seed
INSERT INTO "EventType"("name") VALUES ('normal'),('special'),('feast');


-- CreateIndex
CREATE UNIQUE INDEX "EventType_name_key" ON "EventType"("name");

-- AddForeignKey
ALTER TABLE "InstantaneousScheduleItem" ADD CONSTRAINT "InstantaneousScheduleItem_eventTypeName_fkey" FOREIGN KEY ("eventTypeName") REFERENCES "EventType"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringScheduleItem" ADD CONSTRAINT "RecurringScheduleItem_eventTypeName_fkey" FOREIGN KEY ("eventTypeName") REFERENCES "EventType"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
