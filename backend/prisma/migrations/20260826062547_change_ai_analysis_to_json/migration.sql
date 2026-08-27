/*
  Warnings:

  - The `aiAnalysis` column on the `Analysis` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "aiAnalysis",
ADD COLUMN     "aiAnalysis" JSONB;
