/*
  Warnings:

  - Changed the type of `name` on the `categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CategoryName" AS ENUM ('APARTMENT', 'HOUSE', 'VILLA', 'STUDIO', 'OFFICE', 'GARAGE', 'SHOP', 'FACTORY', 'WAREHOUSE', 'FARMLAND', 'RESORT', 'HOTEL', 'OTHER');

-- DropIndex
DROP INDEX "categories_name_key";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "name",
ADD COLUMN     "name" "CategoryName" NOT NULL;
