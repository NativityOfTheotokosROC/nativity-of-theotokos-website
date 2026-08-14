-- AlterTable
ALTER TABLE "PendingArticleSubmission" ADD COLUMN     "editorEmail" TEXT;

-- CreateTable
CREATE TABLE "Editor" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Editor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Editor_email_key" ON "Editor"("email");

-- AddForeignKey
ALTER TABLE "PendingArticleSubmission" ADD CONSTRAINT "PendingArticleSubmission_editorEmail_fkey" FOREIGN KEY ("editorEmail") REFERENCES "Editor"("email") ON DELETE SET NULL ON UPDATE CASCADE;
