/*
  Warnings:

  - Made the column `email` on table `ArticleAuthor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ArticleAuthor" ALTER COLUMN "email" SET NOT NULL;
