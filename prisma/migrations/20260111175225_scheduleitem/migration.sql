-- CreateTable
CREATE TABLE "ScheduleItem" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "location" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "ScheduleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleItemTime" (
    "id" SERIAL NOT NULL,
    "time" TIME NOT NULL,
    "designation" TEXT NOT NULL,
    "scheduleItemId" INTEGER NOT NULL,

    CONSTRAINT "ScheduleItemTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RemovedScheduleItem" (
    "scheduleItemId" INTEGER NOT NULL,

    CONSTRAINT "RemovedScheduleItem_pkey" PRIMARY KEY ("scheduleItemId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleItem_date_location_key" ON "ScheduleItem"("date", "location");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleItemTime_time_scheduleItemId_key" ON "ScheduleItemTime"("time", "scheduleItemId");

-- AddForeignKey
ALTER TABLE "ScheduleItemTime" ADD CONSTRAINT "ScheduleItemTime_scheduleItemId_fkey" FOREIGN KEY ("scheduleItemId") REFERENCES "ScheduleItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemovedScheduleItem" ADD CONSTRAINT "RemovedScheduleItem_scheduleItemId_fkey" FOREIGN KEY ("scheduleItemId") REFERENCES "ScheduleItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
