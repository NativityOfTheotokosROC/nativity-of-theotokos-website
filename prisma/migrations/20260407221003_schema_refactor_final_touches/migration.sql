-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_imagePlaceholderImageLink_fkey";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_imagePlaceholderImageLink_fkey" FOREIGN KEY ("imagePlaceholderImageLink") REFERENCES "ImagePlaceholder"("imageLink") ON DELETE SET NULL ON UPDATE CASCADE;
