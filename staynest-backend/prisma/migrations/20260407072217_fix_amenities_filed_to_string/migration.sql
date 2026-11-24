/*
  Warnings:

  - The `amenities` column on the `Hotel` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "amenities",
ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[];
