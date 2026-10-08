/*
  Warnings:

  - You are about to drop the column `propertyType` on the `properties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "propertyType",
ALTER COLUMN "description" DROP NOT NULL;
