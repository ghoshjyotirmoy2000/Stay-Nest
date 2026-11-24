-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
