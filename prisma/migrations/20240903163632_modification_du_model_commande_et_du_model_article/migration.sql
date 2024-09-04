/*
  Warnings:

  - You are about to drop the column `details` on the `Articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Articles" DROP COLUMN "details",
ADD COLUMN     "monthService" TEXT,
ADD COLUMN     "service" TEXT;

-- AlterTable
ALTER TABLE "Commande" ADD COLUMN     "monthServicePrice" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "taxeMonthService" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
