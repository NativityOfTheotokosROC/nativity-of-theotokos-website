/*
  Warnings:

  - A unique constraint covering the columns `[englishHash]` on the table `Translation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `englishHash` to the `Translation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Translation" ADD COLUMN     "englishHash" TEXT;

UPDATE "Translation" SET "englishHash" = md5("english");

ALTER TABLE "Translation" ALTER COLUMN     "englishHash" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Translation_englishHash_key" ON "Translation"("englishHash");
