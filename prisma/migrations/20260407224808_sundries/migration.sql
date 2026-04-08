-- This is an empty migration.

WITH "placeholders" AS (
    SELECT "imageLink" FROM "ImagePlaceholder"
)
UPDATE "Image"
SET "imagePlaceholderImageLink" = p."imageLink"
FROM "placeholders" p
WHERE p."imageLink" = "Image"."link";