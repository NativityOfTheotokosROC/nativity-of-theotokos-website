-- CreateTable
CREATE TABLE "ArticleAuthorProfile" (
    "contactEmail" TEXT,
    "articleAuthorId" INTEGER NOT NULL,
    "translationId" INTEGER NOT NULL,

    CONSTRAINT "ArticleAuthorProfile_pkey" PRIMARY KEY ("articleAuthorId")
);

-- CreateTable
CREATE TABLE "ArticleAuthorProfilePicture" (
    "link" TEXT NOT NULL,
    "imagePlaceholderId" INTEGER NOT NULL,
    "articleAuthorProfileArticleAuthorId" INTEGER NOT NULL,

    CONSTRAINT "ArticleAuthorProfilePicture_pkey" PRIMARY KEY ("articleAuthorProfileArticleAuthorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleAuthorProfilePicture_link_key" ON "ArticleAuthorProfilePicture"("link");

-- AddForeignKey
ALTER TABLE "ArticleAuthorProfile" ADD CONSTRAINT "ArticleAuthorProfile_articleAuthorId_fkey" FOREIGN KEY ("articleAuthorId") REFERENCES "ArticleAuthor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleAuthorProfile" ADD CONSTRAINT "ArticleAuthorProfile_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleAuthorProfilePicture" ADD CONSTRAINT "ArticleAuthorProfilePicture_articleAuthorProfileArticleAut_fkey" FOREIGN KEY ("articleAuthorProfileArticleAuthorId") REFERENCES "ArticleAuthorProfile"("articleAuthorId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleAuthorProfilePicture" ADD CONSTRAINT "ArticleAuthorProfilePicture_imagePlaceholderId_fkey" FOREIGN KEY ("imagePlaceholderId") REFERENCES "ImagePlaceholder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
